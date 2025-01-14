import { Box, Container, Typography } from "@mui/material";
import ModelsFilter from "../components/ModelsFilter";
import ModelsList from "../components/ModelsList";
import React, { useState, useEffect, useCallback } from "react";
import { Option } from "../@types/mui";
import { Model } from "../@types/models";

type ModelContainerProps = {
  models: Model[];
};

function ModelContainer({ models }: ModelContainerProps) {
  /*
   * Step 2.
   * The options variable needs to be filled with the relevant options, grouped by the attribute type:
   * Eye Colour: blue, green, etc...
   * Hair Colour: blond, auburn, etc...
   * See the following link for info on how the MUI Autocomplete component expects options
   * https://mui.com/material-ui/react-autocomplete/#grouped
   */

  const eyeColours = [
    ...new Set(
      models.map(({ facial_attributes: { eye_colour } }) => eye_colour)
    ),
  ].map((eyeColours) => ({
    group: "Eye Colour",
    value: eyeColours.toLowerCase(),
  }));
  const hairColours = [
    ...new Set(
      models.map(({ facial_attributes: { hair_colour } }) => hair_colour)
    ),
  ].map((hairColours) => ({
    group: "Hair Colour",
    value: hairColours.toLowerCase(),
  }));

  let options: Option[] = [...eyeColours, ...hairColours];

  const [filteredModels, setFilteredModels] = useState(models);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  /*
   * Step 3.
   * The filterModels function needs to be implemented and called in the relevant place
   */

  const filterModels = useCallback(() => {
    if (selectedOptions.length > 0 && options.length > 0) {
      return models.filter((model) =>
        selectedOptions.some(
          (option) =>
            option.value ===
            model.facial_attributes[
              option.group.toLowerCase().split(" ").join("_") as
                | "hair_colour"
                | "eye_colour"
            ]
        )
      );
    } else {
      return models;
    }
  }, [models, options.length, selectedOptions]);

  useEffect(() => {
    setFilteredModels(filterModels());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  return (
    <>
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Applicant Models
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
          >
            Below is a collection of models for your Company's Marketing
            Campaign. Use the search bar to filter models by their eye or hair
            colour.
          </Typography>
          <ModelsFilter
            options={options}
            setSelectedOptions={setSelectedOptions}
          />
        </Container>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        <ModelsList models={filteredModels} />
      </Container>
    </>
  );
}

export default ModelContainer;

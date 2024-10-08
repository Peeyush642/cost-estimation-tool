import React, { useEffect } from "react";
import { TextField, Typography, Box, Button, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useCost } from "../../../../context/costContext";
import DeleteIcon from "@mui/icons-material/Delete";

function roundedValue(value) {
  return Math.round(value * 100) / 100;
}

function LabourCost({ onCostChange, rejectRate, onPartsPerRunChange, onProcessTimeChange }) {
  const { labourCostData, setLabourCostData, addLabour, removeLabour } =
    useCost(); // Get labour data from context

  const handleChange = (index, field, value) => {
    const updatedLabourData = labourCostData.map((labour, i) =>
      i === index ? { ...labour, [field]: value } : labour
    );
    setLabourCostData(updatedLabourData);
  };

  const partsPerRun = labourCostData.map((labour) => parseFloat(labour.partsPerRun || 0));
  const processTime = labourCostData.map((labour) => parseFloat(labour.labourTime || 0));

  const calculateLabourCost = (labour, index) => {
    const time = parseFloat(labour.labourTime);
    const rate = parseFloat(labour.labourRate);
    const operators = parseFloat(labour.operators);
    const reject = parseFloat(rejectRate[index]) / 100; // Use the corresponding reject rate
    const labourPartsPerRun = parseFloat(labour.partsPerRun);

    if (
      !isNaN(time) &&
      !isNaN(rate) &&
      !isNaN(operators) &&
      !isNaN(reject) &&
      !isNaN(labourPartsPerRun)
    ) {
      const labourCost =
        ((time * rate * operators) / (1 - reject)) * labourPartsPerRun;
      return labourCost.toFixed(2);
    }
    return "0.00";
  };

  const totalCosts = labourCostData.reduce(
    (acc, labour, index) => acc + parseFloat(calculateLabourCost(labour, index) || 0),
    0
  );
  const totalLabourCost = roundedValue(totalCosts);

  useEffect(() => {
    onCostChange(totalLabourCost);
    onPartsPerRunChange(partsPerRun);
    onProcessTimeChange(processTime);
    console.log("Total Labour Cost: ", totalLabourCost);
  }, [totalLabourCost, onCostChange, partsPerRun, onPartsPerRunChange, processTime, onProcessTimeChange]);

  return (
    <Box
      p={2}
      border={1}
      borderColor="grey.300"
      borderRadius={2}
      height={"60vh"}
      overflow={"scroll"}
    >
      <Typography variant="h6" gutterBottom>
        Labour Costs
      </Typography>
      {labourCostData.map((labour, index) => (
        <Grid container spacing={2} key={index} mt={4}>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Labour Type"
              fullWidth
              value={labour.type}
              onChange={(e) => handleChange(index, "type", e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Number of Operators"
              fullWidth
              type="number"
              value={labour.operators}
              onChange={(e) => handleChange(index, "operators", e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Process Time (hrs)"
              fullWidth
              type="number"
              value={labour.labourTime}
              onChange={(e) =>
                handleChange(index, "labourTime", e.target.value)
              }
            />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Parts Per Run"
              fullWidth
              type="number"
              value={labour.partsPerRun}
              onChange={(e) =>
                handleChange(index, "partsPerRun", e.target.value)
              }
            />
          </Grid>
          <Grid item size={{ xs: 6 }}>
            <TextField
              label="Labour Rate (GBP/hr)"
              fullWidth
              type="number"
              value={labour.labourRate}
              onChange={(e) =>
                handleChange(index, "labourRate", e.target.value)
              }
            />
          </Grid>
          <Typography variant="body1" mt={1}>
            Labour Cost: <strong>{calculateLabourCost(labour, index)}</strong>
          </Typography>
          {labourCostData.length > 1 && (
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => removeLabour(index)}
              sx={{ mt: 2 }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Grid>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={addLabour}
        sx={{ mt: 2 }}
      >
        Add Labour
      </Button>
      <Typography variant="h6" mt={2}>
        Total Labour Cost: <strong>{totalLabourCost}</strong>
      </Typography>
    </Box>
  );
}

export default LabourCost;

export const strains = [
    "Multiple_HPV_16_18",
    "Multiple_HPV_non_16_18",
    "Multiple_HPV_16",
    "Multiple_HPV_18",
    "SINGLE_16",
    "SINGLE_18",
    "SINGLE_31",
    "SINGLE_33",
    "SINGLE_35",
    "SINGLE_39",
    "SINGLE_45",
    "SINGLE_51",
    "SINGLE_52",
    "SINGLE_56",
    "SINGLE_58",
    "SINGLE_59",
    "SINGLE_66",
    "SINGLE_68",
  ];
  
  export const convertToStrainsNameFormat = (strain) => {
    return strain.replace(/_/g, " ").replace(/HPV/g, "HPV ");
  };
  
  
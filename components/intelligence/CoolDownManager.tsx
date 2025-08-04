const CoolDownManager = () => {
  const coolDownRules = {
    majorDonor: { days: 45, reason: "High-value relationship preservation" },
    frequent: { days: 21, reason: "Prevent fatigue in active givers" },
    lapsed: { days: 14, reason: "Re-engagement window" }
  };

  const getCoolDownStatus = (donor: Donor) => {
    const daysSinceAsk = donor.urgencyIndicators?.daysSinceLastContact || 0;
    const tier = donor.givingOverview?.tier;
    // Return recommendation with reasoning
  };
};
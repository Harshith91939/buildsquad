export const CAMPAIGN_CONFIG = {
  name: "BuildSquad 7-Day Sprint",
  targetRegistrations: 500,
  durationDays: 7,
  totalBudgetINR: 2000,
  targetCacINR: 4.0, // ₹2000 / 500 = ₹4.00 CAC
  budgetBreakdown: [
    { category: "Micro-Ambassador Bounties", amountINR: 1000, percentage: 50, desc: "Cash rewards for top 3 campus captains & milestone unlocks" },
    { category: "WhatsApp Community Virality", amountINR: 600, percentage: 30, desc: "Group admin collabs & regional engineering hub pushes" },
    { category: "Campus Collateral & Digital Assets", amountINR: 400, percentage: 20, desc: "High-contrast QR cards, story templates & sticker packs" },
  ],
  channels: [
    { id: "whatsapp", label: "WhatsApp Groups", color: "#22c55e" },
    { id: "campus", label: "Campus Direct & QR", color: "#3b82f6" },
    { id: "linkedin", label: "LinkedIn Posts", color: "#0ea5e9" },
    { id: "instagram", label: "Instagram Stories", color: "#ec4899" },
    { id: "discord", label: "Discord Tech Hubs", color: "#8b5cf6" },
    { id: "direct", label: "Direct & Search", color: "#f59e0b" },
  ],
  milestones: [
    { tier: "Gold", minReferrals: 25, reward: "Exclusive Mentorship + ₹500 Bounty + Verified Certificate" },
    { tier: "Silver", minReferrals: 12, reward: "Fast-Track Interview Prep Kit + ₹200 Voucher" },
    { tier: "Bronze", minReferrals: 5, reward: "Full-Stack Project Starter Pack + Digital Badge" },
    { tier: "Rising", minReferrals: 1, reward: "Early Access Community Role" },
  ]
};

// Realistic mock registration sequence for Demo Mode simulation (500 records simulated across 7 days)
export const GENERATE_DEMO_DATA = () => {
  const channels = ['whatsapp', 'campus', 'linkedin', 'instagram', 'discord', 'direct'];
  const channelWeights = [0.42, 0.24, 0.16, 0.10, 0.05, 0.03]; // WhatsApp & Campus dominate student virality
  const ambassadors = ['NXT-ROHIT', 'NXT-SNEHA', 'NXT-PRIYA', 'NXT-AMIT', 'NXT-VARUN', 'NXT-ANANYA', 'NXT-KAVYA', 'NXT-VIKRAM', 'NXT-RITHIK', 'NXT-MEERA'];
  
  const sampleData: { created_at: string; referral_code: string | null; source_channel: string; is_demo: boolean }[] = [];
  
  // Total 382 registrations already completed across 5 days of a 7-day sprint
  const countsPerDay = [34, 52, 78, 98, 120]; 
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 4);
  startDate.setHours(9, 0, 0, 0);

  countsPerDay.forEach((count, dayIndex) => {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + dayIndex);

    for (let i = 0; i < count; i++) {
      const recordTime = new Date(dayDate);
      recordTime.setMinutes(recordTime.getMinutes() + Math.floor(Math.random() * 800));

      // 68% come via referrals
      const isReferral = Math.random() < 0.68;
      const refCode = isReferral ? ambassadors[Math.floor(Math.random() * ambassadors.length)] : null;
      
      // Weighted channel picking
      const rand = Math.random();
      let cumulative = 0;
      let selectedChannel = channels[0];
      for (let c = 0; c < channels.length; c++) {
        cumulative += channelWeights[c];
        if (rand <= cumulative) {
          selectedChannel = channels[c];
          break;
        }
      }

      sampleData.push({
        created_at: recordTime.toISOString(),
        referral_code: refCode,
        source_channel: selectedChannel,
        is_demo: true,
      });
    }
  });

  return sampleData;
};


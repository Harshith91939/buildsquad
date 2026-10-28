import type { ContentTemplate } from '../types';

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'tmpl-whatsapp-1',
    title: 'Urgent 60-Min AI Workshop Broadcast',
    category: 'whatsapp',
    templateText: `🔥 *Free Hands-on AI Workshop for Final-Year Engineers!*

Hey guys! NxtWave is hosting an exclusive sprint:
*“Build Your First AI Project in 60 Minutes”* ⚡

✅ *What you'll build:* A functional AI mini-application deployed live
✅ *Who can attend:* 2026, 2027 & 2028 batch engineering students
✅ *Fee:* 100% Free (Limited to 500 registrations)

Use my priority invite link to lock in your spot:
{{LINK}}

(Referral Code: *{{CODE}}*)`,
    variables: ['LINK', 'CODE'],
  },
  {
    id: 'tmpl-club-1',
    title: 'Coding Club / Department Lead Outreach',
    category: 'club_outreach',
    templateText: `Dear Core Team,

Hope you are doing well.

NxtWave is organizing a practical 60-minute technical session titled *"Build Your First AI Project in 60 Minutes"* designed specifically for Indian engineering students preparing for tech placements and internships.

Key session agenda:
1. LLM API integrations and asynchronous data handling.
2. Hands-on code-along creating a real-world working project.
3. Deployment and live demo.

We would love to extend priority access to members of your tech club. Students can register using our official club referral link:
{{LINK}}

Best regards,
{{NAME}}
BuildSquad Ambassador`,
    variables: ['LINK', 'NAME'],
  },
  {
    id: 'tmpl-social-1',
    title: 'LinkedIn Engineering Student Post',
    category: 'social_post',
    templateText: `Graduating soon and looking to build practical AI projects for your resume? 🚀

I just registered for NxtWave's free hands-on workshop:
“Build Your First AI Project in 60 Minutes”

Unlike theoretical webinars, the entire hour is dedicated to building and deploying a working software project. 

If you are a 2026, 2027, or 2028 batch student, you can claim one of the 500 spots here:
{{LINK}}

#AI #Engineering #NxtWave #WebDevelopment #Coding #Students`,
    variables: ['LINK'],
  },
  {
    id: 'tmpl-headline-1',
    title: 'High-Converting Ad & Story Headlines',
    category: 'headline',
    templateText: `• Variant A: Build Your First AI Project in 60 Minutes [Free Workshop]
• Variant B: From Zero to Deployed AI App Before You Graduate
• Variant C: Stop Watching AI Tutorials. Build Your First Real Project in 1 Hour.
• Variant D: Free 60-Minute AI Project Sprint for 2026-2028 Engineers`,
    variables: [],
  },
  {
    id: 'tmpl-reminder-1',
    title: 'Final 24-Hour Countdown Reminder',
    category: 'reminder',
    templateText: `⏳ *Final Reminder: Spots Closing for 60-Min AI Sprint!*

Our campaign cap of 500 student registrations is almost reached!

If you haven't secured your access yet, grab your spot now:
{{LINK}}

See you at the workshop! 🚀`,
    variables: ['LINK'],
  },
];


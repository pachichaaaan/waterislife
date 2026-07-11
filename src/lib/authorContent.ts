// Content for the Author + Activities pages. Kept verbatim from the supplied
// biography and source notes (a real person — accuracy over paraphrase).

export const AUTHOR_NAME = "Michelle Jadormeo";
export const AUTHOR_ROLES =
  "Freshwater Policy Advocate · Researcher · Public-Service Professional";
export const AUTHOR_TAGLINE = "Water person at heart. Policy advocate by purpose.";
export const AUTHOR_PHOTO = "/michelle-jadormeo.jpg";

export const INTRO_PARAGRAPHS = [
  `Hi, I’m Michelle Jadormeo, a freshwater policy advocate, researcher and public-service professional working at the intersection of water governance, emerging technology, environmental responsibility and community engagement.`,
  `As a 2025–26 Geoffrey F. Bruce Fellow in Canadian Freshwater Policy at Toronto Metropolitan University, my research examines how artificial intelligence and data-centre expansion are creating new pressures on freshwater systems. I investigate the policy gaps and regulatory blind spots surrounding these large-scale water users, particularly in Canada, the Great Lakes region and urban communities where water infrastructure is already under increasing strain.`,
  `My goal is to help Canada move from reactive water management toward governance that is proactive, evidence-based, equitable and respectful of Indigenous water rights. Through the Bruce Fellowship–Canada Water Agency mentorship program, academic research and public-policy engagement, I am developing practical approaches to some of the most urgent water challenges facing communities today.`,
  `My work extends beyond research. I contributed to the national campaign seeking formal recognition of Canada Water Week, helping connect public education, digital outreach, civic participation and the federal parliamentary process. I also serve as a Member at Large with Water Watchers, supporting community-led environmental stewardship and collective action to protect Ontario’s waters and the Great Lakes.`,
  `My broader water and climate activities also include Waterlution, reflecting my commitment to water leadership, climate resilience, youth engagement and community-centred action. Waterlution’s work emphasizes capacity-building, mentorship, innovation and inclusive participation in responding to water and climate challenges.`,
];

export const INTRO_CLOSING = `Across research, advocacy, mentorship and service, I am guided by a simple belief: water is more than a resource. It is a relationship, a shared responsibility and a legacy we must protect for future generations.`;

export type Achievement = {
  title: string;
  body: string;
  bullets?: string[];
  note?: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: "Geoffrey F. Bruce Fellow in Canadian Freshwater Policy",
    body: `Michelle was named a 2025–26 Geoffrey F. Bruce Fellow in Canadian Freshwater Policy. Her fellowship supports research into the freshwater demands of artificial intelligence and data-centre infrastructure and the regulatory challenges these technologies create for Canada. Her research uses comparative policy analysis to examine matters including:`,
    bullets: [
      "provincial water-use and permitting systems;",
      "gaps in data-centre water reporting and oversight;",
      "pressures on the Great Lakes and urban water infrastructure;",
      "policies supporting water reuse; and",
      "policy questions associated with floating or submerged data-centre designs.",
    ],
  },
  {
    title: "Bill Davis / St. George’s Society Graduate Entrance Award",
    body: `Michelle is listed as a 2025 recipient of the Bill Davis / St. George’s Society Graduate Entrance Award in Public Policy and Administration. The award recognizes academic excellence among incoming full-time MPPA students.`,
  },
  {
    title: "Leader of Tomorrow at the 55th St. Gallen Symposium",
    body: `Michelle is included in the Leaders of Tomorrow community for the 55th St. Gallen Symposium, alongside emerging leaders from universities, governments, businesses and social-impact organizations around the world. Her symposium profile highlights her work in freshwater governance, environmental policy and evidence-based decision-making.`,
  },
  {
    title: "Honours Bachelor of Arts with Academic Distinction",
    body: `Michelle completed an Honours Bachelor of Arts in Political Science with Academic Distinction at the University of Toronto. Her academic background included Canadian politics, international relations and public-policy research.`,
  },
  {
    title: "Canada Water Week national advocacy campaign",
    body: `As part of the Bruce Fellowship community, Michelle contributed to a national campaign calling on Parliament to recognize the week containing March 22 as Canada Water Week. The campaign involved:`,
    bullets: [
      "email and social-media outreach;",
      "development of a Canada Water Week logo;",
      "videos, posts and public-education materials;",
      "outreach to universities, watershed organizations, environmental groups and freshwater advocates;",
      "engagement with federal representatives and water-policy leaders; and",
      "participation in an Ottawa visit associated with the campaign.",
    ],
    note: `The official House of Commons record states that petition e-7165 received 863 validated signatures, was presented in Parliament on April 29, 2026, and received a government response on June 12, 2026.`,
  },
  {
    title: "Published author on freshwater advocacy",
    body: `Michelle authored the Toronto Metropolitan University article “Bruce Fellows take action to help protect Canada’s freshwater resources.” Published on May 29, 2026, the article documents the Canada Water Week campaign, its public-engagement strategy, its connection to Parliament and the fellows’ meetings with water-policy leaders.`,
  },
  {
    title: "Member at Large with Water Watchers",
    body: `Michelle serves as a Member at Large with Water Watchers. Her official organizational biography highlights her work on freshwater governance, AI-driven data centres, public engagement and the pressures facing Ontario’s water systems. Her role supports Water Watchers’ efforts to:`,
    bullets: [
      "protect Ontario’s waters;",
      "strengthen community-led environmental stewardship;",
      "support collective action for the Great Lakes; and",
      "promote responsible water decision-making for future generations.",
    ],
  },
  {
    title: "Undergraduate research presentation",
    body: `At the University of Toronto, Michelle contributed to research examining how the civil war in Sudan affected small- and medium-sized enterprises, particularly how businesses communicated, adapted and developed resilience during conflict. She presented this work at the inaugural University of Toronto Scarborough Department of Political Science Research Symposium.`,
  },
];

export type Item = { title: string; body: string };

export const ACTIVITY_SOURCES: Item[] = [
  {
    title: "TMU Geoffrey F. Bruce Fellowship recipient profile",
    body: `The principal institutional profile describing Michelle’s fellowship, AI and data-centre water research, research-assistant work, teaching support, mentorship, student representation and community service.`,
  },
  {
    title: "Detailed Geoffrey F. Bruce Fellow PDF",
    body: `A longer profile explaining her research questions, provincial permitting issues, water reuse and regulatory concerns associated with new forms of data-centre infrastructure.`,
  },
  {
    title: "TMU Graduate Awards profile",
    body: `Documents Michelle’s Bill Davis / St. George’s Society award, University of Toronto education, research projects, academic assistance, mentoring and volunteering.`,
  },
  {
    title: "“How TMU is tackling the global water crisis—right from campus”",
    body: `A TMU news article identifying Michelle as a Bruce Fellow and highlighting her research into AI, data centres and Canadian freshwater-policy gaps.`,
  },
  {
    title: "“Bruce Fellows take action to help protect Canada’s freshwater resources”",
    body: `Michelle’s own article describing the Canada Water Week campaign, outreach activities and Ottawa engagement.`,
  },
  {
    title: "Water Canada coverage",
    body: `Water Canada reported on the Bruce Fellows’ campaign and included Michelle in the featured Ottawa photograph.`,
  },
  {
    title: "House of Commons petition e-7165",
    body: `The official parliamentary record showing the petition’s text, 863 validated signatures, presentation date and government response.`,
  },
  {
    title: "Water Watchers team profile",
    body: `The official nonprofit profile listing Michelle as a Member at Large and describing her freshwater-policy and advocacy interests.`,
  },
  {
    title: "St. Gallen Symposium Leaders of Tomorrow profile",
    body: `Lists Michelle within the 55th St. Gallen Symposium community and summarizes her education, freshwater work and reported Ministry of Infrastructure appointment.`,
  },
  {
    title: "Waterlution official pages",
    body: `Waterlution’s website verifies the organization’s water-and-climate leadership mandate and describes its Y4RC programming, but it does not publicly connect Michelle’s name to a specific Waterlution role or cohort.`,
  },
];

export type Group = { heading: string; items: Item[] };

export const ACTIVITY_GROUPS: Group[] = [
  {
    heading: "Freshwater & environmental-policy activities",
    items: [
      {
        title: "AI and data-centre water research",
        body: `Michelle researches AI-driven data centres as an emerging category of large-scale water user. Her work examines whether Canada’s existing policy, permitting and regulatory systems are prepared for the water demands associated with digital infrastructure.`,
      },
      {
        title: "Great Lakes freshwater-policy research",
        body: `As a research assistant, Michelle has worked on a project studying freshwater-policy issues in the Great Lakes region.`,
      },
      {
        title: "Bruce Fellowship–Canada Water Agency mentorship",
        body: `Michelle participates in the Bruce Fellowship–Canada Water Agency mentorship program, learning from national water-policy leaders about evidence-based, principled and forward-looking freshwater governance.`,
      },
      {
        title: "Canada Water Week public engagement",
        body: `Michelle helped support communications, outreach and public engagement surrounding the Canada Water Week campaign. During the Ottawa component, the fellows attended the National Water Literacy Project launch and met government officials, Indigenous water leaders, the President of the Canada Water Agency and freshwater-policy advocates.`,
      },
      {
        title: "Water Watchers",
        body: `As a Member at Large, Michelle contributes to advocacy and collective action concerning Ontario’s waters, the Great Lakes and community-led stewardship.`,
      },
      {
        title: "Waterlution",
        body: `Michelle’s activities include involvement with Waterlution, whose official organizational work centres on water and climate leadership, capacity-building, mentorship, innovation, youth action and place-based community engagement.`,
      },
    ],
  },
  {
    heading: "Academic & research activities",
    items: [
      {
        title: "Research assistant: remote and online voting",
        body: `Michelle has worked as a research assistant on a project examining online and remote voting behaviour in Nova Scotia municipalities.`,
      },
      {
        title: "Research assistant: Great Lakes freshwater policy",
        body: `She has also supported faculty research concerning freshwater-policy issues in the Great Lakes region.`,
      },
      {
        title: "Academic assistant",
        body: `Michelle has served as an academic assistant for Power and Influence in Canadian Politics, supporting undergraduate learning, civic literacy and democratic engagement.`,
      },
      {
        title: "MPPA Program Council representative",
        body: `She has represented students on the Toronto Metropolitan University MPPA Program Council.`,
      },
      {
        title: "Tri-Mentoring Program",
        body: `Michelle has mentored undergraduate students through Toronto Metropolitan University’s Tri-Mentoring Program.`,
      },
    ],
  },
  {
    heading: "Community & service activities",
    items: [
      {
        title: "Journey Home Hospice",
        body: `Michelle has volunteered with Journey Home Hospice, supporting and providing compassionate care to people experiencing homelessness.`,
      },
      {
        title: "Canadian Red Cross",
        body: `Her public TMU profile states that she has volunteered with the Canadian Red Cross.`,
      },
      {
        title: "Youth empowerment and gender equity",
        body: `Michelle has contributed to nonprofit activities supporting youth empowerment and gender equity. The publicly available profile does not identify the organization names or formal titles.`,
      },
      {
        title: "Student mentorship and representation",
        body: `Her service also includes undergraduate mentorship and representation of graduate students through the MPPA Program Council.`,
      },
    ],
  },
];

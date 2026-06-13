// The six ESRS questionnaire sections, in the spec's intentional order:
// E1, E2, E3, E5, E4, then S2/G1 as one final step. Each field's `name`
// matches the questionnaire_responses column exactly, so the insert payload
// needs no mapping. `label` text is verbatim from product-spec.md Section 5.
// `type` drives the input component: 'number' | 'textarea' | 'yesno'.
//
// Every field is optional. The array order here is the single guardrail that
// keeps E5 before E4 — do not reorder.

export const ESRS_SECTIONS = [
  {
    id: 'e1',
    code: 'E1',
    title: 'Climate & Decarbonization',
    fields: [
      { name: 'e1_scope1_emissions', type: 'number', label: 'Scope 1 emissions, last fiscal year' },
      { name: 'e1_scope2_emissions', type: 'number', label: 'Scope 2 emissions, last fiscal year' },
      { name: 'e1_scope3_emissions', type: 'number', label: 'Scope 3 emissions, last fiscal year' },
      {
        name: 'e1_decarbonization_roadmap',
        type: 'textarea',
        label:
          'Describe your top three decarbonization projects in progress or planned for the next 24 months, including estimated tCO2e reduction and the specific technology used',
      },
      {
        name: 'e1_implementation_barriers',
        type: 'textarea',
        label:
          'What are the primary technical or financial barriers preventing a 50% reduction in Scope 1 and 2 emissions by 2030?',
      },
    ],
  },
  {
    id: 'e2',
    code: 'E2',
    title: 'Pollution & PFAS',
    fields: [
      {
        name: 'e2_substances_of_concern_weight',
        type: 'number',
        label: 'Total weight of substances of concern used in production',
      },
      {
        name: 'e2_pfas_alternative_strategy',
        type: 'textarea',
        label:
          'If products contain PFAS, detail your substitution roadmap, viable non-PFAS alternatives, and target phase-out date',
      },
      {
        name: 'e2_wastewater_management',
        type: 'textarea',
        label:
          'Describe your industrial wastewater treatment process and the measures ensuring zero leakage of hazardous chemicals into local water systems',
      },
    ],
  },
  {
    id: 'e3',
    code: 'E3',
    title: 'Water & Marine Resources',
    fields: [
      {
        name: 'e3_water_stewardship_projects',
        type: 'textarea',
        label:
          'Details on water-saving or closed-loop recycling projects, and how total water intensity has changed over three years',
      },
      {
        name: 'e3_scarcity_contingency',
        type: 'textarea',
        label:
          'If in a high-water-stress region, the operational contingency plan for severe drought to ensure supply continuity',
      },
    ],
  },
  {
    id: 'e5',
    code: 'E5',
    title: 'Circular Economy & Waste',
    fields: [
      {
        name: 'e5_design_for_circularity',
        type: 'textarea',
        label:
          'How circularity is incorporated into the components you supply (design for disassembly, modularity, recycled content)',
      },
      {
        name: 'e5_waste_reduction_diversion',
        type: 'textarea',
        label:
          'Strategy for Zero Waste to Landfill, primary waste streams, and recent recycling or upcycling initiatives',
      },
    ],
  },
  {
    id: 'e4',
    code: 'E4',
    title: 'Biodiversity & Ecosystems',
    fields: [
      {
        name: 'e4_site_impact_mitigation',
        type: 'textarea',
        label:
          'Initiatives to minimise operational impact on local biodiversity (land use, native planting, light and noise reduction)',
      },
    ],
  },
  {
    id: 's2g1',
    code: 'S2/G1',
    title: 'Social, Labour & Governance',
    fields: [
      {
        name: 's2_human_rights_policy',
        type: 'yesno',
        label:
          'Does your organisation have a formal Human Rights and Labour Rights Policy, aligned with the UN Guiding Principles on Business and Human Rights?',
      },
      {
        name: 's2_human_rights_due_diligence',
        type: 'yesno',
        label:
          'Have you conducted a human rights due diligence assessment of your Tier 1 and Tier 2 supply chains in the last 24 months?',
      },
      {
        name: 's2_grievance_mechanism',
        type: 'textarea',
        label:
          'Describe the grievance mechanism available to workers in your supply chain, and how many grievances were filed and resolved in the last 12 months',
      },
      {
        name: 'g1_conflict_minerals_policy',
        type: 'yesno',
        label:
          'Does your organisation have a verified conflict minerals policy (3TG: tin, tantalum, tungsten, gold) in place, including OECD Due Diligence guidance compliance?',
      },
      {
        name: 'g1_supplier_code_of_conduct',
        type: 'textarea',
        label:
          'Describe your supplier code of conduct, how compliance is monitored across your own supply chain, and any third-party audits in the last 24 months',
      },
    ],
  },
]

// Flat list of every numeric field name — used to coerce strings to numbers
// (or null) before insert, since inputs always yield strings.
export const NUMERIC_FIELDS = ESRS_SECTIONS.flatMap((s) =>
  s.fields.filter((f) => f.type === 'number').map((f) => f.name),
)

// Flat list of all questionnaire field names (for building the insert payload).
export const ALL_QUESTION_FIELDS = ESRS_SECTIONS.flatMap((s) =>
  s.fields.map((f) => f.name),
)

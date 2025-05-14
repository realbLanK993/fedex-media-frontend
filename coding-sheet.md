# Media Monitoring Sheet: Column Descriptions

This document outlines the purpose and calculation method for each column in the media monitoring spreadsheet.

---

## I. Manual Input / Basic Information

1.  **Quarter**

    - **Description:** Fiscal Year and Quarter of the media coverage (e.g., FY24 Q1).
    - **Type:** Manual Input (String).

2.  **Company**

    - **Description:** The company being tracked (e.g., FedEx, DHL, UPS, Local competitor).
    - **Type:** Manual Input (String, selected from a predefined dropdown list).

3.  **Country**

    - **Description:** The country or region where the media coverage originated (e.g., APAC, ANZ, CN, IND).
    - **Type:** Manual Input (String, selected from a predefined dropdown list).

4.  **Date**

    - **Description:** The publication date of the media article (e.g., 13-Sep-23).
    - **Type:** Manual Input (Date format: dd-mmm-yy).

5.  **Headline**

    - **Description:** The exact headline of the media article as published.
    - **Type:** Manual Input (String).

6.  **Hyperlink**

    - **Description:** The direct URL to the online article.
    - **Type:** Manual Input (String/URL).

7.  **Outlet**

    - **Description:** The name of the media publication or source (e.g., Post & Parcel, Reuters, Air Cargo News).
    - **Type:** Manual Input (String, ideally selected from a predefined dropdown list).

8.  **Circulation**

    - **Description:** The estimated readership, viewership, or reach of the media outlet. "Not Found" is used if this information is unavailable.
    - **Type:** Manual Input (Numeric or the string "Not Found").

9.  **Media Type**

    - **Description:** The category of the media (e.g., Print, Online, Broadcast, Social Media).
    - **Type:** Manual Input (String, selected from a predefined dropdown list).

10. **Photo/Video**

    - **Description:** Indicates whether a photo or video relevant to the tracked company was included with the article.
    - **Type:** Manual Input (String: "Yes" or "No", selected from a dropdown).

11. **Headline (Company Name Check - Column K)**

    - **Description:** Indicates if the tracked **Company's name appears directly in the article's headline**.
    - **Type:** Manual Input (String: "Yes" or "No", selected from a dropdown).

12. **Focus**

    - **Description:** Specifies the prominence of the company in the article.
      - **Focus:** The company is the main subject of the article.
      - **Mention:** The company is mentioned but is not the primary subject.
    - **Type:** Manual Input (String: "Focus" or "Mention", selected from a dropdown).

13. **Sentiment**

    - **Description:** The overall tone of the article concerning the tracked company.
      - **Positive:** The article portrays the company favorably.
      - **Negative:** The article portrays the company unfavorably.
      - **Neutral:** The article is balanced or factual without a strong positive or negative leaning.
    - **Type:** Manual Input (String: "Positive", "Negative", or "Neutral", selected from a dropdown).

14. **Page Position**

    - **Description:** Describes where the article was placed within the publication, indicating its visibility.
      - _Examples for Online:_ "[Online] Above the fold (using resolution 1600 x 900)", "[Online] Home page", "[Online] Prominent on section page".
      - _Examples for Print:_ "Print Front Page", "Print Page <5", "Print Back Page".
    - **Type:** Manual Input (String, selected from a predefined dropdown list).

15. **Section Position**
    - **Description:** The specific section of the publication where the article appeared.
      - _Examples for Online:_ "[Online] Anywhere outside of home page of online platform", "Business Section Online".
      - _Examples for Print:_ "Print Business Section", "Print Lifestyle Section".
    - **Type:** Manual Input (String, selected from a predefined dropdown list).

---

## II. Communication Pillars & Themes (Manual Binary Flags)

For each of the following pillars/themes, enter **1** if the article prominently features or discusses this aspect related to the company. Enter **0** or leave blank if not present.

16. **Products & Services**

    - **Description:** Coverage mentions or focuses on specific products or services offered by the company.

17. **AMEA/APAC President Positioning**

    - **Description:** Coverage significantly features, quotes, or positions the AMEA/APAC President.

18. **AMEA/APAC Executive Present**

    - **Description:** Coverage significantly features or quotes other AMEA/APAC executives (excluding the President).

19. **Local Leader Present**

    - **Description:** Coverage significantly features or quotes a local market leader, country manager, or equivalent.

20. **Financial Performance**

    - **Description:** Coverage discusses the company's financial results, earnings reports, stock performance, or economic outlook.

21. **Innovation**

    - **Description:** Coverage highlights the company's innovations in technology, services, processes, or business models.

22. **Global Leadership**

    - **Description:** Coverage positions the company as a leader in the global market or its specific industry.

23. **Executive Leadership (Pillar)**

    - **Description:** Coverage focuses on the strength, vision, or strategic direction provided by the company's executive team as a key theme (distinct from just an executive being quoted).

24. **Regulatory**

    - **Description:** Coverage relates to regulatory matters, compliance issues, government policies, or legal aspects affecting the company.

25. **Business Leadership (General - Col Y)**

    - **Description:** Coverage positions the company as a leader in general business practices, strategy, market presence, or industry influence. (Note: The Excel sheet header for this column may have a trailing space: `Business Leadership `)

26. **Contributes to Community**

    - **Description:** Highlights the company's community involvement, corporate social responsibility (CSR) activities (excluding specific environmental/social themes covered separately).

27. **Environmentally responsible**

    - **Description:** Focuses on the company's efforts towards environmental sustainability, green initiatives, or reducing environmental impact.

28. **Socially responsible**

    - **Description:** Focuses on broader social responsibility initiatives such as ethical practices, labor standards, human rights, etc.

29. **Cares about market’s social needs**

    - **Description:** Demonstrates the company's understanding and actions to address specific social needs within its operating markets.

30. **SAM**

    - **Description:** Coverage related to a specific strategic area, customer segment, or initiative denoted by the acronym "SAM" (e.g., Strategic Account Management, Small-and-Medium Businesses). The exact meaning is internally defined.

31. **E-commerce**

    - **Description:** Coverage focuses on the company's role, solutions, or impact in the e-commerce sector.

32. **Asia-EU/Intra-AMEA**

    - **Description:** Highlights trade lanes, operations, strategy, or developments related to Asia-Europe connections or activities within the AMEA (Asia Pacific, Middle East, and Africa) region.

33. **Operational Strength**

    - **Description:** Emphasizes the company's efficiency, network capabilities, reliability, logistical prowess, or other operational capabilities.

34. **Business Leadership (Specific - Col AH)**

    - **Description:** Another defined aspect of business leadership, potentially focusing on a specific campaign, market, or attribute. (Note: The Excel sheet header for this is `Business Leadership` without a trailing space)

35. **Sustainability**

    - **Description:** Coverage discusses the company's broader sustainability agenda, which may encompass environmental, social, and governance (ESG) aspects.

36. **Plays Social / Economic Role**

    - **Description:** Highlights the company's wider impact on society or the economy, such as job creation, enabling trade, or contributing to economic growth.

37. **Workplace DEI**
    - **Description:** Focuses on the company's initiatives, performance, or recognition related to Diversity, Equity, and Inclusion in the workplace.

---

## III. Calculated/Derived Metrics

These columns are automatically calculated based on the manual inputs.

38. **Total # of Pillars Present**

    - **Description:** The sum of all the binary communication pillar flags (typically columns P and T through AK in the standard template). Counts how many key messages were present in the article.
    - **Calculation:** `SUM(of all relevant pillar columns that are marked '1')`

39. **President**

    - **Description:** A simple "Yes" or "No" flag indicating if the `AMEA/APAC President Positioning` pillar (Column Q) was marked as '1'.
    - **Calculation:** `IF(AMEA/APAC President Positioning = 1, "Yes", "No")`

40. **AMEA Executive**

    - **Description:** A "Yes" or "No" flag indicating if the `AMEA/APAC Executive Present` pillar (Column R) was marked as '1'.
    - **Calculation:** `IF(AMEA/APAC Executive Present = 1, "Yes", "No")`

41. **Local Leader**

    - **Description:** A "Yes" or "No" flag indicating if the `Local Leader Present` pillar (Column S) was marked as '1'.
    - **Calculation:** `IF(Local Leader Present = 1, "Yes", "No")`

42. **Publication Weight**

    - **Description:** A predefined numerical weight or score assigned to each media outlet based on its tier, influence, or importance. This value is looked up from a separate "Publication List" or master data.
    - **Type:** Lookup (Numeric, often a percentage or a factor).

43. **Page Weight**

    - **Description:** A numerical weight assigned based on the `Page Position` of the article. More prominent positions (e.g., front page, above the fold) receive higher weights.
    - **Type:** Lookup (Numeric, typically a percentage or a factor, e.g., 100% for best position).

44. **Section Weight**

    - **Description:** A numerical weight assigned based on the `Section Position` of the article. Placement in more relevant or prominent sections receives higher weights.
    - **Type:** Lookup (Numeric, typically a percentage or a factor).

45. **W Circ (Raw Circulation for Calculation - AS)**

    - **Description:** This column represents the **numerical value of Circulation (Column H)** to be used in subsequent calculations. If "Circulation" is "Not Found", this is treated as 0. The column header in the sheet "W Circ" might be misleading if it's just the raw number. _Alternatively, if this column intends to be `Circulation _ Publication Weight`, the calculation would be `Circulation (H) _ Publication Weight (AP)`._ The formulas in AU and AV suggest AS might be an intermediate weighted value. For clarity, let's assume it's the raw circulation value for now unless specified otherwise.
    - **Calculation (if raw):** `VALUE(Circulation (H), treat "Not Found" as 0)`
    - **Calculation (if intermediate weighted):** `Circulation (H) * Publication Weight (AP)`

46. **Ph mult (Photo/Video Multiplier)**

    - **Description:** A multiplier applied to the circulation if a photo or video featuring the company was included. Typically a value like 1.15 (for a 15% boost) if "Yes", and 1.0 if "No".
    - **Calculation:** `IF(Photo/Video (J) = "Yes", [defined_multiplier_e.g_1.15], 1.0)`

47. **Weighted Circulation (uncorrected)**

    - **Description:** An intermediate weighted circulation value.
    - **Calculation:** `W Circ (AS) * Ph mult (AT)`. (If AS is raw circulation, this is `Raw_Circulation * Photo_Multiplier`. If AS is `Circulation * Pub_Weight`, then this is `Circulation * Pub_Weight * Photo_Multiplier`).
    - _The exact formula depends on the definition of column AS._

48. **Weighted Circulation**

    - **Description:** The final key metric representing the overall weighted reach or impact of the article. It considers the outlet's base circulation/reach, modified by weights for publication tier, article placement, section, and presence of visuals.
    - **Calculation:** `Weighted Circulation (uncorrected) (AU) * Page Weight (AQ) * Section Weight (AR)`
    - If `Weighted Circulation (uncorrected)` (AU) is `Circulation * Pub_Weight * Photo_Multiplier`, then this is `Circulation * Pub_Weight * Photo_Multiplier * Page_Weight * Section_Weight`.

49. **Positive Weighted Circulation**

    - **Description:** The value of `Weighted Circulation` (AV) if the article's `Sentiment` (Column M) is "Positive". If sentiment is "Negative" or "Neutral", this value is 0. This is used to isolate the impact of positive coverage.
    - **Calculation:** `IF(Sentiment (M) = "Positive", Weighted Circulation (AV), 0)`

50. **Cumulative Executive**
    - **Description:** This metric captures the `Positive Weighted Circulation` if any executive (AMEA/APAC President, AMEA/APAC Executive, or Local Leader) was featured in the article. If no executive was present, this value is 0.
    - **Calculation:** `IF(OR(President (AM)="Yes", AMEA Executive (AN)="Yes", Local Leader (AO)="Yes"), Positive Weighted Circulation (AW), 0)`

---

_This template assumes specific column letters for calculations. Adjust if your sheet layout differs._
_The definition of "W Circ (AS)" significantly impacts subsequent weighted circulation calculations. Clarify its exact formula._

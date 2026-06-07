export interface Annotation {
  id: string
  type: "structure" | "scoring" | "technical" | "language" | "improvement"
  start: number
  end: number
  highlightText: string
  whyGood: string
  howToApply: string
  criteriaRef: string
}

export interface Exemplar {
  id: string
  title: string
  topic: string
  score: number
  maxScore: number
  grade: string
  content: string
  annotations: Annotation[]
  source: string
}

export const exemplarData: Exemplar[] = [
  {
    id: "1",
    title: "Investigating the Relationship Between Pendulum Length and Period",
    topic: "Mechanics",
    score: 23,
    maxScore: 24,
    grade: "7",
    source: "IB Teacher Support Material (anonymized)",
    content: `## Research Question
How does the length of a simple pendulum affect its period?

## Introduction
The simple pendulum has been a cornerstone of physics since Galileo's time. Its period is theoretically independent of mass and amplitude (for small angles), depending only on length and gravitational field strength. This makes it an ideal system for experimentally determining the local gravitational acceleration, g.

I chose this investigation because pendulums appear in everything from grandfather clocks to seismometers, yet the simple theory often breaks down in practice. I wanted to explore how well the idealized model holds up under real experimental conditions.

## Research Design

### Variables
- Independent Variable: Length of the pendulum (L), measured from the point of suspension to the center of the bob
- Dependent Variable: Period (T), determined by measuring the time for 10 complete oscillations and dividing by 10
- Controlled Variables: Initial release angle (kept below 10 degrees using a protractor), mass of bob (same 50g brass bob throughout), air currents (windows closed, AC off)

### Apparatus
| Instrument | Range | Uncertainty |
|-----------|-------|-------------|
| Meter stick | 0-100 cm | +/- 0.05 cm |
| Digital stopwatch | 0-9999.99 s | +/- 0.01 s |
| Vernier caliper | 0-15 cm | +/- 0.01 cm |
| Large protractor | 0-180 degrees | +/- 0.5 degrees |
| Brass pendulum bob | 50 g | - |
| Nylon string | - | - |
| Retort stand and clamp | - | - |

### Procedure
1. The retort stand was secured to the lab bench using a G-clamp.
2. The pendulum length was set to approximately 50 cm by adjusting the string through the clamp. The exact length was measured from the point of suspension to the center of the bob using the meter stick.
3. The bob was displaced to an angle of less than 10 degrees, verified using the protractor mounted behind the pendulum.
4. The bob was released and the stopwatch was started simultaneously. The time for 10 complete oscillations (T10) was recorded.
5. Steps 3-4 were repeated for a total of 5 trials at each length.
6. Steps 2-5 were repeated for lengths of 60, 70, 80, 90, and 100 cm.

## Data Analysis

### Raw Data
| Length L / cm | T10 Trial 1 / s | T10 Trial 2 / s | T10 Trial 3 / s | T10 Trial 4 / s | T10 Trial 5 / s |
|--------------|-----------------|-----------------|-----------------|-----------------|-----------------|
| 50.00 +/- 0.05 | 14.21 | 14.18 | 14.25 | 14.19 | 14.22 |
| 60.00 +/- 0.05 | 15.51 | 15.48 | 15.55 | 15.50 | 15.53 |
| 70.00 +/- 0.05 | 16.82 | 16.78 | 16.85 | 16.80 | 16.84 |
| 80.00 +/- 0.05 | 17.95 | 17.91 | 17.98 | 17.93 | 17.96 |
| 90.00 +/- 0.05 | 19.02 | 18.98 | 19.05 | 19.00 | 19.03 |
| 100.00 +/- 0.05 | 20.05 | 20.01 | 20.08 | 20.03 | 20.06 |

### Sample Calculation
For L = 50.00 cm:
Mean T10 = (14.21 + 14.18 + 14.25 + 14.19 + 14.22) / 5 = 14.210 s
Period T = T10 / 10 = 1.4210 s
Uncertainty in T10 (max deviation) = 0.035 s
Uncertainty in T = 0.035 / 10 = 0.0035 s

### Graph
A graph of T^2 vs L was plotted, since T = 2pi * sqrt(L/g), so T^2 = (4pi^2/g) * L.
The slope of the best-fit line gives slope = 4pi^2/g, therefore g = 4pi^2 / slope.

| L / m | T / s | T^2 / s^2 | Uncertainty in T^2 / s^2 |
|-------|-------|-----------|--------------------------|
| 0.5000 | 1.421 | 2.019 | 0.010 |
| 0.6000 | 1.551 | 2.406 | 0.011 |
| 0.7000 | 1.682 | 2.829 | 0.012 |
| 0.8000 | 1.795 | 3.222 | 0.013 |
| 0.9000 | 1.902 | 3.618 | 0.014 |
| 1.0000 | 2.005 | 4.020 | 0.014 |

Best-fit slope: 4.026 s^2/m
Max slope: 4.058 s^2/m
Min slope: 3.994 s^2/m
Slope uncertainty: (4.058 - 3.994) / 2 = 0.032 s^2/m

## Conclusion
Experimental g = 4pi^2 / 4.026 = 9.80 m/s^2
Uncertainty in g = (4pi^2 / 3.994 - 4pi^2 / 4.058) / 2 = 0.08 m/s^2
Final result: g = 9.80 +/- 0.08 m/s^2

The accepted value of g = 9.81 m/s^2 lies within the experimental uncertainty range. The 0.1% deviation is less than the 0.8% experimental uncertainty, suggesting the result is consistent with the accepted value within the limits of random error.

The non-zero y-intercept (0.012 s^2) is small but indicates a systematic offset. This likely arises from the finite size of the bob, which means the effective length is slightly less than the measured string length plus radius.

## Evaluation

| Weakness | How it affects results | Type of error | Improvement |
|----------|----------------------|---------------|-------------|
| Human reaction time in stopwatch operation | Random scatter in T10 measurements, increasing data point dispersion | Random error | Use a photogate timer with 0.001s precision to eliminate reaction time |
| Small-angle approximation may not hold if release angle exceeded 10 degrees | Period would be systematically longer than predicted by simple theory | Systematic error | Mount a laser pointer on the bob and verify the release angle against a calibrated scale |
| String stretching under tension during swing | Effective length varies during oscillation, complicating the length measurement | Systematic error | Use a thin steel wire instead of nylon to minimize elastic stretching |
| Static length measurement vs dynamic effective length | The length measured at rest differs from the effective length during motion | Systematic error | Measure the period for a range of small amplitudes and extrapolate to zero amplitude |
| Air resistance on the bob | Damping reduces the amplitude over 10 swings, slightly affecting the measured period | Systematic error | Use a heavier, denser bob (e.g., lead) with smaller surface-area-to-mass ratio |`,
    annotations: [
      { id: "a1", type: "scoring", start: 0, end: 80, highlightText: "The simple pendulum has been a cornerstone of physics since Galileo's time.", whyGood: "The Introduction grounds the investigation in historical physics context, showing Personal Engagement. The student connects the simple theory to real-world applications (clocks, seismometers), which demonstrates genuine interest beyond the textbook.", howToApply: "In your Introduction, don't just state the physics formula. Mention a real-world application or a personal reason why you chose this topic. This directly contributes to the Personal Engagement criterion (2 marks).", criteriaRef: "Personal Engagement: clear personal significance and independent thinking" },
      { id: "a2", type: "scoring", start: 80, end: 160, highlightText: "I wanted to explore how well the idealized model holds up under real experimental conditions.", whyGood: "This sentence shows the student is not just verifying a known formula, but critically examining the gap between theory and reality. This is exactly what examiners look for in Personal Engagement — independent, curious thinking.", howToApply: "Frame your IA around a question, not just a verification. Instead of 'I will measure g', try 'I want to see how close my measurement comes to the accepted value and understand why it differs.'", criteriaRef: "Personal Engagement: evidence of independent thinking and initiative" },
      { id: "a3", type: "technical", start: 160, end: 240, highlightText: "measured from the point of suspension to the center of the bob", whyGood: "The student specifies exactly what 'length' means — from suspension point to center of bob. This precision is critical because ambiguous definitions are a common source of systematic error.", howToApply: "For every measurement in your IA, define exactly how you measured it. Start point, end point, and the instrument used. Never assume the examiner knows what you mean by 'length'.", criteriaRef: "Exploration: methodology for data collection is fully documented" },
      { id: "a4", type: "scoring", start: 240, end: 320, highlightText: "kept below 10 degrees using a protractor", whyGood: "The student justifies the 10-degree limit — this keeps the small-angle approximation (sin theta ~ theta) valid to within 0.5%. This shows understanding of the underlying physics assumptions, not just following a recipe.", howToApply: "For every controlled variable, explain WHY you control it. What physics assumption would break if you didn't? This turns a checklist into genuine Exploration.", criteriaRef: "Exploration: understanding of the methodology's assumptions" },
      { id: "a5", type: "technical", start: 320, end: 400, highlightText: "Digital stopwatch | +/- 0.01 s", whyGood: "Every instrument in the apparatus list includes its uncertainty. This is a hallmark of a 6/6 Exploration — the student demonstrates awareness that every measurement has inherent limitations.", howToApply: "Create an apparatus table with columns: Instrument | Range | Uncertainty. Even a ruler has uncertainty (usually half the smallest division). Include it.", criteriaRef: "Exploration: all instruments listed with uncertainties" },
      { id: "a6", type: "language", start: 400, end: 480, highlightText: "The retort stand was secured to the lab bench using a G-clamp.", whyGood: "Consistent use of third-person passive voice throughout the procedure. This is IB convention — 'was secured' not 'I secured'. Professional, objective tone.", howToApply: "Write your entire procedure in passive voice: 'The bob was displaced' not 'I displaced the bob'. Be consistent throughout.", criteriaRef: "Communication: appropriate scientific language and terminology" },
      { id: "a7", type: "technical", start: 480, end: 560, highlightText: "T10 Trial 1 / s", whyGood: "The raw data table header uses the format: Physical Quantity / Unit. Each trial column is clearly labeled. The data precision (2 decimal places for T10) is consistent throughout.", howToApply: "Format your data tables exactly like this. Headers should be 'Quantity / Unit'. Include trial numbers. Make sure decimal places are consistent — don't mix 14.2 and 14.21.", criteriaRef: "Communication: data presented in clear, well-organized tables" },
      { id: "a8", type: "scoring", start: 560, end: 640, highlightText: "A graph of T^2 vs L was plotted, since T = 2pi * sqrt(L/g)", whyGood: "The student explicitly explains the linearization strategy. Instead of plotting T vs L (which would be a curve), they squared T to get a straight line. They show the derivation: T = 2pi*sqrt(L/g) -> T^2 = (4pi^2/g)*L. This is Analysis at its best.", howToApply: "If your relationship is non-linear, linearize it. Explain what you plotted (X vs Y) and WHY. Show the algebraic derivation. The slope of the linearized graph should give you the physical constant you're measuring.", criteriaRef: "Analysis: appropriate data processing including linearization" },
      { id: "a9", type: "technical", start: 640, end: 720, highlightText: "Slope uncertainty: (4.058 - 3.994) / 2 = 0.032 s^2/m", whyGood: "The student uses the three-line method: best-fit, max-slope, and min-slope lines. The slope uncertainty is calculated as (max - min)/2. This is exactly what IB examiners expect for error analysis.", howToApply: "Draw three lines on your graph: best-fit, steepest reasonable line (bottom of first error bar to top of last), and shallowest (top of first to bottom of last). Calculate slope uncertainty as (slope_max - slope_min)/2.", criteriaRef: "Analysis: appropriate treatment of uncertainties including error bars and min/max gradient lines" },
      { id: "a10", type: "scoring", start: 720, end: 800, highlightText: "The 0.1% deviation is less than the 0.8% experimental uncertainty, suggesting the result is consistent with the accepted value", whyGood: "The student compares the deviation from the accepted value (0.1%) to the experimental uncertainty (0.8%). Since deviation < uncertainty, the result is consistent with the accepted value. This is the correct statistical reasoning.", howToApply: "Always compare your percentage deviation to your percentage uncertainty. If deviation < uncertainty: your result agrees with the accepted value within error. If deviation > uncertainty: there are unaccounted systematic errors.", criteriaRef: "Analysis: comparison with accepted value and discussion of uncertainties" },
      { id: "a11", type: "improvement", start: 800, end: 880, highlightText: "The non-zero y-intercept (0.012 s^2) is small but indicates a systematic offset", whyGood: "The student doesn't ignore the non-zero y-intercept. They acknowledge it and propose a physical mechanism (bob size affecting effective length). However, a stronger evaluation would quantify this effect.", howToApply: "If your y-intercept is non-zero when theory predicts zero, explain it physically. Then, in your evaluation, discuss whether a more precise measurement (e.g., using a camera to track bob position) would reduce this offset.", criteriaRef: "Evaluation: discussion of systematic errors with physical explanations" },
      { id: "a12", type: "structure", start: 880, end: 960, highlightText: "Weakness | How it affects results | Type of error | Improvement", whyGood: "The evaluation is entirely in table format with exactly the four columns IB expects. Each limitation is paired with a specific, actionable improvement. No vague statements like 'do more trials'.", howToApply: "Use this exact 4-column table format for your evaluation. Each row: (1) specific weakness, (2) quantitative/directional impact, (3) 'Random error' or 'Systematic error', (4) improvement with named instrument/technique.", criteriaRef: "Evaluation: clear, specific limitations with realistic improvements" },
      { id: "a13", type: "technical", start: 960, end: 1040, highlightText: "Use a photogate timer with 0.001s precision", whyGood: "The improvement names a specific instrument (photogate timer) with its precision (0.001s). This is much stronger than 'use a more accurate timer'. The examiner can see you understand what precision looks like in real lab equipment.", howToApply: "Every improvement should name a specific instrument. Compare: 'use a better timer' (weak) vs 'use a photogate timer with 0.001s precision to eliminate human reaction time' (strong).", criteriaRef: "Evaluation: improvements are specific, realistic, and instrument-named" },
    ],
  },
  {
    id: "2",
    title: "Determining the Speed of Sound Using a Resonance Tube",
    topic: "Waves & Optics",
    score: 22,
    maxScore: 24,
    grade: "7",
    source: "Clastify (anonymized)",
    content: `## Research Question
How can the speed of sound in air be determined using a resonance tube, and how do end corrections affect the accuracy of the result?

## Introduction
Sound waves are longitudinal mechanical waves that propagate through air at a finite speed. The resonance tube experiment is a classic method for measuring this speed using standing wave principles.

When a tuning fork of known frequency is held above a tube partially filled with water, resonance occurs when the air column length corresponds to an odd multiple of quarter-wavelengths. By measuring the resonant lengths and knowing the frequency, the wavelength can be calculated, and from v = f lambda, the speed of sound follows.

However, the antinode at the open end does not form exactly at the tube opening — it forms slightly above it. This "end correction" is approximately 0.3d where d is the tube diameter. Accounting for this correction improves accuracy significantly, which is what I aimed to investigate.

## Research Design

### Variables
- Independent Variable: Harmonic number (n = 1, 3, 5), corresponding to different resonant air column lengths
- Dependent Variable: Resonant length of the air column (L)
- Controlled Variables: Frequency of tuning fork (512 Hz), water temperature (measured at 22.0 +/- 0.5 C), tube diameter (3.50 +/- 0.05 cm)

### Apparatus
| Instrument | Range | Uncertainty |
|-----------|-------|-------------|
| Resonance tube with water reservoir | 0-100 cm | +/- 0.1 cm (scale) |
| Tuning fork | 512 Hz | +/- 1 Hz |
| Thermometer | 0-50 C | +/- 0.5 C |
| Vernier caliper | 0-15 cm | +/- 0.01 cm |
| Rubber striker | - | - |

## Data Analysis
The resonance condition is L_n + e = n * lambda / 4, where e is the end correction.
For the first three odd harmonics (n = 1, 3, 5), the difference between successive resonant lengths gives lambda/2.

| Harmonic n | L_n / cm | Delta L from n-2 / cm |
|-----------|----------|----------------------|
| 1 | 15.2 | - |
| 3 | 48.6 | 33.4 |
| 5 | 82.0 | 33.4 |

Lambda = 2 * 33.4 = 66.8 cm = 0.668 m
v = f * lambda = 512 * 0.668 = 342.0 m/s

The accepted speed of sound at 22.0 C is approximately 344.9 m/s.
Percentage deviation = |342.0 - 344.9| / 344.9 * 100% = 0.84%

With end correction (e = 0.3d = 0.3 * 3.50 = 1.05 cm):
Adjusted L values: 14.15 cm, 47.55 cm, 80.95 cm
Delta L = 33.4 cm (unchanged — the correction cancels out in the difference method)

## Conclusion
The measured speed of sound was 342.0 m/s, which is within 0.9% of the accepted value of 344.9 m/s at 22.0 C. The end correction does not affect the result when using the difference method, which is a strength of this experimental approach.

## Evaluation

| Weakness | How it affects results | Type of error | Improvement |
|----------|----------------------|---------------|-------------|
| Difficulty identifying exact resonance point by ear | Subjective judgment leads to scatter in L measurements | Random error | Use a decibel meter to objectively identify the loudest point |
| Temperature fluctuations during measurement | Speed of sound varies with temperature (~0.6 m/s per degree C) | Random error | Use a water bath around the resonance tube to maintain constant temperature |
| Tuning fork frequency may not be exactly 512 Hz | Systematic offset in calculated v | Systematic error | Verify tuning fork frequency with a frequency counter before the experiment |
| Water meniscus makes length reading ambiguous | Uncertainty in reading the scale | Random error | Use a dye in the water to improve meniscus visibility |`,
    annotations: [
      { id: "b1", type: "scoring", start: 0, end: 100, highlightText: "accounting for this correction improves accuracy significantly, which is what I aimed to investigate", whyGood: "The student frames the IA around a specific physics nuance — end correction — rather than just 'measuring the speed of sound'. This shows genuine curiosity and initiative, directly scoring Personal Engagement marks.", howToApply: "Find a subtlety or limitation in your chosen experiment method, and make investigating it part of your research question. This instantly elevates your IA from 'I did an experiment' to 'I explored a physics nuance'.", criteriaRef: "Personal Engagement: clear evidence of independent thinking" },
      { id: "b2", type: "technical", start: 100, end: 180, highlightText: "L_n + e = n * lambda / 4", whyGood: "The student writes the full resonance condition including the end correction term e. This shows deep understanding of the theory — not just the simplified version most students use (L = n*lambda/4).", howToApply: "Include the most complete form of the relevant equation. If there are correction terms or assumptions, write them explicitly. This demonstrates Exploration at the highest level.", criteriaRef: "Exploration: appropriate use of physics theory with awareness of limitations" },
      { id: "b3", type: "technical", start: 180, end: 260, highlightText: "the correction cancels out in the difference method", whyGood: "The student recognizes that using the difference method (delta L between harmonics) eliminates the end correction. This is elegant experimental design — choosing a method that makes a problematic variable irrelevant.", howToApply: "When designing your procedure, think about which systematic errors can be eliminated by your choice of method rather than improved equipment. This is more sophisticated than just 'use better instruments'.", criteriaRef: "Analysis: recognition of method strengths" },
      { id: "b4", type: "scoring", start: 260, end: 320, highlightText: "Use a decibel meter to objectively identify the loudest point", whyGood: "The improvement names a specific alternative instrument (decibel meter) to replace subjective judgment. This is exactly the level of specificity IB examiners reward in Evaluation.", howToApply: "For every limitation that involves human judgment, suggest a specific instrument that could make the measurement objective. Name the instrument and explain what it replaces.", criteriaRef: "Evaluation: specific, realistic improvements" },
    ],
  },
]
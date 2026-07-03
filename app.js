/* ==========================================================================
   SMONO QUIT SMOKING WELLNESS APP - JAVASCRIPT APP LOGIC
   ========================================================================== */

// --- Global Application State ---
const state = {
  currentScreenId: 'welcome-1',
  userName: 'Siddhi',
  cigarettesPerDay: 15,
  packCost: 12.00, // Pack of 20 cigarettes
  yearsSmoked: 8,
  stressLevel: 'High',
  hasPaid: false,
  language: 'en',
  appTheme: 'light',
  currencySymbol: '$',
  currencyCode: 'USD',
  minutesPerCigarette: 7,
  selectedProgramDay: 1,
  todaySmokedCount: 0,
  dailySmokedLogs: {},
  
  // Onboarding questionnaire progress
  currentQuestionIndex: 1,
  answers: {},
  onboardingActive: false,
  
  // Track questionnaire path (so we can go back cleanly)
  questionHistory: [],
  maxUnlockedDay: 1,
  completedReflections: {},
  completedTasks: {}
};

// --- Full List of Countries for Search Selector ---
const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
  "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Georgia", "Germany", 
  "Ghana", "Greece", "Guatemala", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", 
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", 
  "Lebanon", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Malaysia", "Maldives", "Mexico", "Monaco", "Mongolia", 
  "Morocco", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", 
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Singapore", 
  "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan", "Thailand", 
  "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Venezuela", "Vietnam", "Yemen", "Zimbabwe"
];

// --- Custom 36-Question Definition Array ---
// Options formats: 'select' (single select), 'slider' (slider widget), 'text' (text input)
const onboardingQuestions = [
  {
    id: 1,
    question: "What is your name?",
    support: "We will use this to personalize your Smono daily modules.",
    type: "text",
    placeholder: "Enter your first name...",
    defaultValue: "Siddhi"
  },
  {
    id: 2,
    question: "What country do you live in?",
    support: "This helps us calculate local smoking costs and currency metrics.",
    type: "select",
    options: ["India", "United States", "United Kingdom", "Canada", "Australia", "France", "Germany", "Other"]
  },
  {
    id: 3,
    question: "What is your age?",
    support: "Nicotine biological recovery rate projections adapt to age groups.",
    type: "slider",
    min: 18,
    max: 75,
    defaultValue: 28,
    unit: "years old"
  },
  {
    id: 4,
    question: "What is your gender?",
    support: "This helps us customize wellness and cellular recovery computations.",
    type: "select",
    options: ["Female", "Male", "Non-binary", "Prefer not to say"]
  },
  {
    id: 5,
    question: "What form of nicotine do you consume?",
    support: "Select all forms that apply to your habits.",
    type: "select",
    isMultiSelect: true,
    options: ["Cigarettes", "Vaping / E-Cigarettes", "Hookah / Sheesha", "Smokeless tobacco", "Other"]
  },
  {
    id: 6,
    question: "How long have you been using nicotine?",
    support: "Every year you've smoked can be recovered once you quit.",
    type: "select",
    options: ["Under 1 year", "1 - 3 years", "3 - 5 years", "5 - 10 years", "10+ years"]
  },
  {
    id: 7,
    question: "When do you typically smoke?",
    support: "Select all that apply.",
    type: "select",
    isMultiSelect: true,
    options: [
      "First thing in the morning",
      "After meals",
      "With coffee or tea",
      "During work breaks",
      "When I feel stressed",
      "In the evening to unwind",
      "While socialising",
      "When drinking alcohol",
      "Before sleeping",
      "While driving or commuting",
      "When I feel bored",
      "Other"
    ]
  },
  {
    id: 8,
    question: "What is your primary smoking environment?",
    support: "Select all environments where you typically smoke.",
    type: "select",
    isMultiSelect: true,
    options: ["Socializing with friends", "Alone at home", "Driving / Commuting", "Work breaks", "Stressful moments"]
  },
  {
    id: 9,
    question: "How many cigarettes do you smoke per day?",
    support: "Drag the slider to match your average daily intake.",
    type: "slider",
    min: 1,
    max: 80,
    defaultValue: 15,
    unit: "cigarettes"
  },
  {
    id: 10,
    question: "What is the approximate cost of a pack (20 cigs)?",
    support: "We will use this to calculate your exact financial savings.",
    type: "slider",
    min: 2,
    max: 30,
    defaultValue: 12.00,
    unit: "USD ($)",
    step: 0.5
  },
  {
    id: 11,
    question: "For how many years have you smoked?",
    support: "This is crucial for estimating your lifetime breathing capacity toll.",
    type: "slider",
    min: 1,
    max: 60,
    defaultValue: 8,
    unit: "years"
  },
  {
    id: 12,
    question: "How many minutes do you take to smoke one cigarette?",
    support: "Average time per cigarette including preparation and breaks.",
    type: "slider",
    min: 2,
    max: 20,
    defaultValue: 7,
    unit: "minutes"
  },
  {
    id: 13,
    question: "At what age did you start smoking?",
    support: "Early triggers often dictate core behavioral links.",
    type: "select",
    options: ["Under 18", "18 - 21", "22 - 25", "26+"]
  },
  {
    id: 14,
    question: "When do you usually smoke your first cigarette?",
    support: "This helps us evaluate your chemical dependency level.",
    type: "select",
    options: ["Within 5 minutes of waking up", "Within 30 minutes", "Within 1 hour", "Later in the day"]
  },
  {
    id: 15,
    question: "What triggers you most?",
    support: "Recognizing your trigger loop is the key to replacing it.",
    type: "select",
    options: ["Stress & anxiety", "Coffee / Alcohol pairings", "Social pressure", "Boredom / Driving", "Finishing meals"]
  },
  {
    id: 16,
    question: "When are cravings strongest for you?",
    support: "We will schedule daily motivation cards for these peaks.",
    type: "select",
    options: ["Early mornings", "Midday work breaks", "Evenings", "Late at night", "Random / Variable times"]
  },
  {
    id: 17,
    question: "Why do you want to quit smoking?",
    support: "This core driver will anchor your custom daily program.",
    type: "select",
    options: ["Physical health / breathing quality", "Family & loved ones", "Financial savings", "Self-confidence / Freedom", "Social / Hygiene"]
  },
  {
    id: 18,
    question: "Have you tried quitting before?",
    support: "Every slip is a learning lesson, never a failure.",
    type: "select",
    options: ["Yes, once", "Yes, multiple times", "No, this is my first time"]
  },
  {
    id: 19,
    question: "What made previous attempts difficult?",
    support: "Identifying roadblocks helps us prepare trigger guides.",
    type: "select",
    options: ["Intense cravings & urges", "Social events / Peer pressure", "High stress / Life events", "Mood swings / Irritability", "Lack of a structured program"]
  },
  {
    id: 20,
    question: "How stressed do you feel day to day?",
    support: "Smono tailors stress-reduction models to your score.",
    type: "select",
    options: ["Low stress", "Moderate stress", "High stress", "Overwhelming stress"]
  },
  {
    id: 21,
    question: "Do you smoke more when anxious or socializing?",
    support: "We differentiate between cognitive anxiety and social habit triggers.",
    type: "select",
    options: ["Mostly when anxious / alone", "Mostly when socializing / drinking", "Both equally", "Neither"]
  },
  {
    id: 22,
    question: "Do you live with other smokers?",
    support: "Environment matters. We provide tips to maintain clear boundaries.",
    type: "select",
    options: ["Yes, partner smokes", "Yes, family members smoke", "Yes, roommates smoke", "No, smoke-free household"]
  },
  {
    id: 23,
    question: "How do you want to change your relationship with smoking?",
    support: "There is no wrong answer. Smono meets you where you are.",
    type: "select",
    options: [
      "I want to quit smoking completely",
      "I want to reduce first, then quit",
      "I have already quit and want to stay smoke-free",
      "I’m not sure yet"
    ]
  },
  {
    id: 24,
    question: "How many times have you tried to cut back or quit in the past?",
    support: "Every attempt teaches us something. This time, we’ll use those lessons.",
    type: "select",
    options: [
      "Never, this is my first attempt",
      "1 to 3 times",
      "4 to 10 times",
      "Lost count"
    ]
  },
  {
    id: 25,
    question: "How confident are you about quitting this time?",
    support: "It is normal to feel nervous. Smono is here to support, not judge.",
    type: "select",
    options: ["Very confident", "Moderately confident", "A bit nervous / Hesitant", "Extremely anxious"]
  },
  {
    id: 26,
    question: "Why do you want to change your smoking or nicotine habits?",
    support: "Select up to three.",
    type: "select",
    isMultiSelect: true,
    maxSelect: 3,
    options: [
      "Improve my health",
      "For my family",
      "Save money",
      "Feel more energetic",
      "Mental peace",
      "More time in the day",
      "Feel better about myself",
      "Improve appearance",
      "Feel in control again",
      "Prepare for a new chapter in life"
    ]
  },
  {
    id: 27,
    question: "What matters most to you right now?",
    support: "Your immediate goal will be prioritized on your dashboard.",
    type: "select",
    options: ["Saving cash immediately", "Clear lungs & better stamina", "Protecting my family's second-hand exposure", "Gaining self-discipline"]
  },
  {
    id: 28,
    question: "How often do you feel guilty about smoking?",
    support: "Smono operates on shame-free coaching. Healing starts here.",
    type: "select",
    options: ["Every single time I smoke", "Frequently", "Occasionally", "Rarely / Never"]
  },
  {
    id: 29,
    question: "Have you ever used any of these to help cut down or quit?",
    support: "Select all that apply.",
    type: "select",
    isMultiSelect: true,
    options: [
      "Nicotine gums or patches",
      "Varenicline, bupropion, or other medication",
      "Naturopathy / homeopathy / ayurveda",
      "Hypnosis",
      "Acupuncture",
      "Cold turkey",
      "Quit smoking apps",
      "Counselling or therapy",
      "No, I haven’t used anything yet"
    ]
  },
  {
    id: 30,
    question: "Do you want daily check-in reminders?",
    support: "Consistency builds new pathways. Highly recommended.",
    type: "select",
    options: ["Yes, morning and evening", "Yes, mornings only", "Yes, evenings only", "No, I'll log in manually"]
  },
  {
    id: 31,
    question: "How much support do you prefer?",
    support: "You can adjust notification frequency at any time.",
    type: "select",
    options: ["Max Support (Reminders, quotes, SOS support)", "Balanced (Standard daily modules only)", "Quiet (Self-guided, no notifications)"]
  },
  {
    id: 32,
    question: "What time of day works best for check-ins?",
    support: "Select the hour when you are typically relaxing.",
    type: "select",
    options: ["Morning (8:00 AM - 10:00 AM)", "Lunchtime (12:00 PM - 2:00 PM)", "Evening (6:00 PM - 8:00 PM)", "Bedtime (9:00 PM - 11:00 PM)"]
  },
  {
    id: 33,
    question: "Do you want motivational trigger quotes sent to you?",
    support: "Reassuring texts help ground you during craving peaks.",
    type: "select",
    options: ["Yes, send daily motivation", "Yes, but only on weekends", "No, thanks"]
  },
  {
    id: 34,
    question: "What is your main language for learning modules?",
    support: "You can change language options later in Settings.",
    type: "select",
    options: ["English", "Hindi", "Marathi", "Gujarati", "French", "German", "Italian", "Spanish"]
  },
  {
    id: 35,
    question: "What is your current occupation style? (Optional)",
    support: "Identifies desk-stress vs manual fatigue cues.",
    type: "select",
    options: ["Desk job / Office worker", "Physical labor / Outdoors", "Student / Learning", "Homemaker / Full-time parent", "Retired / Unemployed", "Other"]
  },
  {
    id: 36,
    question: "Are you worried about nicotine cravings?",
    support: "Cravings peak for 10 minutes. Smono provides instant breathing tools.",
    type: "select",
    options: ["Very worried", "Slightly worried", "Not worried"]
  },
  {
    id: 37,
    question: "Are you worried about relapse or slipping?",
    support: "Smono supports you through slips. No shame, just recovery.",
    type: "select",
    options: ["Very worried", "Slightly worried", "Not worried"]
  },
  {
    id: 38,
    question: "Are you worried about physical withdrawal symptoms?",
    support: "Headaches and coughing are signs of lungs cleaning out.",
    type: "select",
    options: ["Very worried", "Slightly worried", "Not worried"]
  },
  {
    id: 39,
    question: "What outcome makes this journey successful for you?",
    support: "Define your victory milestone.",
    type: "select",
    options: ["100% Smoke-Free forever", "Reducing daily intake by 90%", "Cessation for at least 6 months", "Better respiratory health & breathing"]
  },
  {
    id: 40,
    question: "Are you ready to commit to a guided plan?",
    support: "One day at a time. No giant leaps needed.",
    type: "select",
    options: ["Yes, I am ready to start", "Yes, but I want to take it slow", "I'm hesitant but want to try"]
  },
  {
    id: 41,
    question: "Final Commitment: Will you take the first step today?",
    support: "This is your agreement to be kind to yourself through this program.",
    type: "select",
    options: ["I commit to my smoke-free future", "I commit to taking it day-by-day"]
  }
];

// --- Math Calculation Core Engine ---
function recalculateDynamicValues() {
  const qty = state.cigarettesPerDay;
  const cost = state.packCost;
  const years = state.yearsSmoked;
  
  const costPerCig = cost / 20;
  
  // Lifetime stats
  const lifetimeCigs = Math.round(qty * 365 * years);
  const lifetimeSpend = Math.round(lifetimeCigs * costPerCig);
  
  // Time lost (Standard medical rate: 11 minutes of life lost per cigarette)
  const lifeMinsLost = lifetimeCigs * 11;
  const lifeDaysLost = Math.round(lifeMinsLost / 60 / 24);
  
  // Active time spent smoking (Minutes per cigarette entered in Q11)
  const activeMinutesSpent = lifetimeCigs * state.minutesPerCigarette;
  const activeHoursSpent = Math.round(activeMinutesSpent / 60);
  const activeDaysSpent = Math.round(activeHoursSpent / 24);
  
  // Projections
  const weeklySpend = Math.round(qty * 7 * costPerCig);
  const monthlySpend = Math.round(qty * 30 * costPerCig);
  const yearlySpend = Math.round(qty * 365 * costPerCig);
  
  const avoidedYear = Math.round(qty * 365);

  // Update DOM elements on the dynamic reveal insight cards
  const elSpentLifetime = document.getElementById('insight-spent-lifetime');
  const elSpentMonthly = document.getElementById('insight-spent-monthly');
  const elSpentYearly = document.getElementById('insight-spent-yearly');
  
  const elCigsCount = document.getElementById('insight-cigs-count');
  const elLifeLost = document.getElementById('insight-life-lost');
  
  const elSaveYear = document.getElementById('insight-save-year');
  const elAvoidedYear = document.getElementById('insight-avoided-year');

  const elOfferSpentWeekly = document.getElementById('offer-spent-weekly');
  const elObjCostSmoking = document.getElementById('obj-cost-smoking');
  const elObjCostSavedYear = document.getElementById('obj-cost-saved-year');
  
  const elDashSavedMoney = document.getElementById('dash-saved-money');

  // Time Spent Insight DOM elements
  const elTimeSpentDays = document.getElementById('insight-time-spent-days');
  const elTimeSpentHours = document.getElementById('insight-time-spent-hours');
  const elTimeSpentMins = document.getElementById('insight-time-spent-mins');
  const elTimeSpentDesc = document.getElementById('insight-time-spent-desc');

  if (elSpentLifetime) elSpentLifetime.innerText = `${state.currencySymbol}${lifetimeSpend.toLocaleString()}`;
  if (elSpentMonthly) elSpentMonthly.innerText = `${state.currencySymbol}${monthlySpend}`;
  if (elSpentYearly) elSpentYearly.innerText = `${state.currencySymbol}${yearlySpend.toLocaleString()}`;
  
  if (elCigsCount) elCigsCount.innerText = `${lifetimeCigs.toLocaleString()}`;
  if (elLifeLost) elLifeLost.innerText = `${lifeDaysLost} days`;
  
  if (elSaveYear) elSaveYear.innerText = `${state.currencySymbol}${yearlySpend.toLocaleString()}`;
  if (elAvoidedYear) elAvoidedYear.innerText = `${avoidedYear.toLocaleString()}`;

  if (elOfferSpentWeekly) elOfferSpentWeekly.innerText = `${state.currencySymbol}${weeklySpend.toFixed(2)}`;
  if (elObjCostSmoking) elObjCostSmoking.innerText = `${state.currencySymbol}${monthlySpend}`;
  if (elObjCostSavedYear) elObjCostSavedYear.innerText = `${state.currencySymbol}${yearlySpend.toLocaleString()}`;
  
  const elObjExpensiveSaveYear = document.getElementById('obj-expensive-save-year');
  if (elObjExpensiveSaveYear) elObjExpensiveSaveYear.innerText = `${state.currencySymbol}${yearlySpend.toLocaleString()}`;

  const elObjPaySmokingYear = document.getElementById('obj-pay-smoking-year');
  if (elObjPaySmokingYear) elObjPaySmokingYear.innerText = `${state.currencySymbol}${yearlySpend.toLocaleString()} spent`;

  // Populate time spent values
  if (elTimeSpentDays) elTimeSpentDays.innerText = `${activeDaysSpent.toLocaleString()} Days`;
  if (elTimeSpentHours) elTimeSpentHours.innerText = `${activeHoursSpent.toLocaleString()} Hours`;
  if (elTimeSpentMins) elTimeSpentMins.innerText = `${activeMinutesSpent.toLocaleString()}m`;
  if (elTimeSpentDesc) elTimeSpentDesc.innerText = `Toll calculated at ${state.minutesPerCigarette} minutes per cigarette.`;
  
  // Localized Premium Prices based on selected currency code
  const localizedPrices = {
    USD: { old: '$49.99', new: '$19.99' },
    INR: { old: '₹3,999', new: '₹1,699' },
    GBP: { old: '£39.99', new: '£14.99' },
    EUR: { old: '€44.99', new: '€17.99' },
    CAD: { old: 'C$59.99', new: 'C$24.99' },
    AUD: { old: 'A$64.99', new: 'A$26.99' },
    AED: { old: 'AED 180', new: 'AED 75' }
  };

  const activePrice = localizedPrices[state.currencyCode] || localizedPrices.USD;

  // Dynamically calculate payback days based on premium cost and daily smoking spend
  const programCostVal = Number(activePrice.new.replace(/[^0-9.]/g, ''));
  const dailySpend = weeklySpend / 7;
  const paybackDays = dailySpend > 0 ? Math.max(1, Math.round(programCostVal / dailySpend)) : 3;

  // Sales & Checkout Pricing DOM elements
  const elOfferPriceOld = document.getElementById('offer-price-old');
  const elOfferPriceNew = document.getElementById('offer-price-new');
  const elObjCostProgramPrice = document.getElementById('obj-cost-program-price');
  const elPaywallUnlockBtn = document.getElementById('paywall-unlock-btn');

  if (elOfferPriceOld) elOfferPriceOld.innerText = activePrice.old;
  if (elOfferPriceNew) elOfferPriceNew.innerText = activePrice.new;
  if (elObjCostProgramPrice) elObjCostProgramPrice.innerText = activePrice.new;
  if (elPaywallUnlockBtn) elPaywallUnlockBtn.innerText = `Unlock Premium for ${activePrice.new}`;

  // Dynamic payback period explanations
  const elOfferSpentComparison = document.querySelector('.savings-comparison p');
  if (elOfferSpentComparison) {
    elOfferSpentComparison.innerHTML = `Compared to your weekly smoking spend of <strong>${state.currencySymbol}${weeklySpend.toLocaleString()}</strong>, Smono Premium pays for itself in less than <strong>${paybackDays} days</strong>.`;
  }

  const elObjCostMathText = document.querySelector('.comp-math p');
  if (elObjCostMathText) {
    elObjCostMathText.innerHTML = `By using Smono to quit, Smono Premium pays for itself in <strong>less than ${paybackDays} days</strong>, and you'll save over <strong class="color-green" id="obj-cost-saved-year">${state.currencySymbol}${yearlySpend.toLocaleString()}</strong> in your first smoke-free year.`;
  }

  // Update dynamic tracker metrics
  updateTrackerRealtimeStats();
}

// --- Dynamic Questionnaire Renderer ---
function renderQuestionIndex(idx) {
  const questionObj = onboardingQuestions[idx - 1];
  if (!questionObj) return;

  const elProgress = document.getElementById('questionnaire-progress');
  const elIndicator = document.getElementById('questionnaire-indicator');
  const elTitle = document.getElementById('question-text');
  const elSupport = document.getElementById('question-support');
  const elOptionsContainer = document.getElementById('question-options-container');

  // Update indicator and progress bar
  const progressPercent = Math.round((idx / onboardingQuestions.length) * 100);
  if (elProgress) elProgress.style.width = `${progressPercent}%`;
  if (elIndicator) elIndicator.innerText = `Question ${idx} of ${onboardingQuestions.length}`;
  
  // Set question content
  if (elTitle) elTitle.innerText = questionObj.question;
  if (elSupport) elSupport.innerText = questionObj.support;

  // Clear options container
  if (!elOptionsContainer) return;
  elOptionsContainer.innerHTML = '';

  // Get current answer if it exists
  const currentAnswer = state.answers[idx];

  if (questionObj.id === 2) {
    // Searchable Country Dropdown Screen
    const val = currentAnswer !== undefined ? currentAnswer : 'India';
    
    if (state.answers[idx] === undefined) {
      state.answers[idx] = val;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'searchable-dropdown-wrapper';

    // Search Box Input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'theme-input search-box-input';
    searchInput.placeholder = '🔍 Search country...';
    searchInput.style.marginBottom = '10px';
    searchInput.style.borderRadius = '14px';
    searchInput.style.border = '1px solid var(--color-border-card)';
    searchInput.style.background = 'var(--color-bg-glass)';
    searchInput.style.color = 'var(--color-text-primary)';
    searchInput.style.padding = '12px 16px';
    searchInput.style.fontSize = '14px';
    searchInput.style.width = '100%';
    searchInput.style.outline = 'none';

    // Dropdown list container
    const listContainer = document.createElement('div');
    listContainer.className = 'dropdown-items-scroll';

    // Helper function to render items
    const renderItems = (filterText = '') => {
      listContainer.innerHTML = '';
      const filtered = countryList.filter(c => c.toLowerCase().includes(filterText.toLowerCase()));
      
      if (filtered.length === 0) {
        const noResult = document.createElement('div');
        noResult.className = 'dropdown-no-results';
        noResult.innerText = 'No countries found';
        listContainer.appendChild(noResult);
        return;
      }

      filtered.forEach(country => {
        const item = document.createElement('div');
        const isActive = state.answers[idx] === country;
        item.className = `dropdown-item ${isActive ? 'active' : ''}`;
        
        item.onclick = () => {
          state.answers[idx] = country;
          renderItems(searchInput.value);
          
          setTimeout(() => {
            handleQuestionNext();
          }, 300);
        };

        item.innerHTML = `
          <span>${country}</span>
          <span class="option-check"></span>
        `;
        listContainer.appendChild(item);
      });
    };

    searchInput.oninput = () => {
      renderItems(searchInput.value);
    };

    renderItems(''); // Initial render

    wrapper.appendChild(searchInput);
    wrapper.appendChild(listContainer);
    elOptionsContainer.appendChild(wrapper);
  } else if (questionObj.id === 3) {
    // Custom Age Selector Screen
    const currentAnswer = state.answers[idx];
    
    // Default exact age value
    let currentAgeVal = 28;
    let selectedPreset = null; // 'under18' or 'above75'

    if (currentAnswer === 'Under 18') {
      selectedPreset = 'under18';
    } else if (currentAnswer === '75+') {
      selectedPreset = 'above75';
    } else if (typeof currentAnswer === 'number') {
      currentAgeVal = currentAnswer;
    } else {
      // Default initial state
      state.answers[idx] = currentAgeVal;
    }

    const ageWrapper = document.createElement('div');
    ageWrapper.className = 'custom-age-selector-wrapper';

    // Preset options row
    const presetsRow = document.createElement('div');
    presetsRow.className = 'age-presets-row';

    const under18Card = document.createElement('div');
    under18Card.className = `age-preset-card glass-card ${selectedPreset === 'under18' ? 'active' : ''}`;
    under18Card.innerHTML = `
      <span class="age-preset-title">Under 18</span>
      <span class="age-preset-desc">Years Old</span>
    `;

    const above75Card = document.createElement('div');
    above75Card.className = `age-preset-card glass-card ${selectedPreset === 'above75' ? 'active' : ''}`;
    above75Card.innerHTML = `
      <span class="age-preset-title">75+</span>
      <span class="age-preset-desc">Years Old</span>
    `;

    presetsRow.appendChild(under18Card);
    presetsRow.appendChild(above75Card);

    // Divider
    const dividerText = document.createElement('div');
    dividerText.className = 'age-divider-text';
    dividerText.innerText = 'Or drag to select exact age:';

    // Slider controls
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'quest-input-wrapper';

    const valueBubble = document.createElement('div');
    valueBubble.className = 'slider-val-bubble';
    
    if (selectedPreset === 'under18') {
      valueBubble.innerText = 'Under 18 years old';
    } else if (selectedPreset === 'above75') {
      valueBubble.innerText = '75+ years old';
    } else {
      valueBubble.innerText = `${currentAgeVal} years old`;
    }

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'quest-range-slider';
    slider.min = 18;
    slider.max = 75;
    slider.value = selectedPreset ? 18 : currentAgeVal;
    if (selectedPreset) {
      slider.style.opacity = '0.5';
    }

    // Wiring actions
    under18Card.onclick = () => {
      state.answers[idx] = 'Under 18';
      under18Card.classList.add('active');
      above75Card.classList.remove('active');
      valueBubble.innerText = 'Under 18 years old';
      slider.style.opacity = '0.5';
      
      setTimeout(() => {
        handleQuestionNext();
      }, 300);
    };

    above75Card.onclick = () => {
      state.answers[idx] = '75+';
      above75Card.classList.add('active');
      under18Card.classList.remove('active');
      valueBubble.innerText = '75+ years old';
      slider.style.opacity = '0.5';

      setTimeout(() => {
        handleQuestionNext();
      }, 300);
    };

    slider.oninput = () => {
      selectedPreset = null;
      under18Card.classList.remove('active');
      above75Card.classList.remove('active');
      slider.style.opacity = '1';
      
      const exactAge = Number(slider.value);
      valueBubble.innerText = `${exactAge} years old`;
      state.answers[idx] = exactAge;
    };

    sliderContainer.appendChild(valueBubble);
    sliderContainer.appendChild(slider);

    // Min-Max labels
    const minMaxLabelRow = document.createElement('div');
    minMaxLabelRow.className = 'input-slider-label-row';
    minMaxLabelRow.innerHTML = `
      <span>Min: 18</span>
      <span>Max: 75</span>
    `;
    sliderContainer.appendChild(minMaxLabelRow);

    ageWrapper.appendChild(presetsRow);
    ageWrapper.appendChild(dividerText);
    ageWrapper.appendChild(sliderContainer);

    elOptionsContainer.appendChild(ageWrapper);
  } else if (questionObj.id === 10) {
    // Custom Currency & Pack Cost Selector Screen
    const currentAnswer = state.answers[idx];
    
    const currencies = [
      { code: 'USD', symbol: '$' },
      { code: 'INR', symbol: '₹' },
      { code: 'GBP', symbol: '£' },
      { code: 'EUR', symbol: '€' },
      { code: 'CAD', symbol: 'C$' },
      { code: 'AUD', symbol: 'A$' },
      { code: 'AED', symbol: 'AED ' }
    ];

    const container = document.createElement('div');
    container.className = 'currency-pack-cost-wrapper';

    // Currency horizontal pill row
    const label = document.createElement('div');
    label.className = 'currency-selector-label';
    label.innerText = 'Select your currency:';
    container.appendChild(label);

    const pillRow = document.createElement('div');
    pillRow.className = 'currency-presets-row';

    // Current cost setup
    let currentCostVal = currentAnswer !== undefined ? currentAnswer : state.packCost;

    // Helper to setup slider ranges based on currency code
    const getSliderRanges = (code) => {
      if (code === 'INR') {
        return { min: 50, max: 500, step: 10, def: 330 };
      } else {
        return { min: 2, max: 30, step: 0.5, def: 12.00 };
      }
    };

    // If answer exists but doesn't fit ranges (e.g. they switched currency), reset to default
    if (state.currencyCode === 'INR' && currentCostVal < 50) {
      currentCostVal = 330;
      state.packCost = 330;
      state.answers[idx] = 330;
    } else if (state.currencyCode !== 'INR' && currentCostVal > 50) {
      currentCostVal = 12.00;
      state.packCost = 12.00;
      state.answers[idx] = 12.00;
    }

    const ranges = getSliderRanges(state.currencyCode);

    // Render currency presets
    currencies.forEach(curr => {
      const pill = document.createElement('div');
      const isSelected = state.currencyCode === curr.code;
      pill.className = `currency-preset-pill ${isSelected ? 'active' : ''}`;
      pill.innerHTML = `
        <span class="curr-code">${curr.code}</span>
        <span class="curr-sym">${curr.symbol.trim()}</span>
      `;

      pill.onclick = () => {
        // Update state
        state.currencyCode = curr.code;
        state.currencySymbol = curr.symbol;
        
        // Remove active class from sibling pills
        const siblings = pillRow.querySelectorAll('.currency-preset-pill');
        siblings.forEach(s => s.classList.remove('active'));
        pill.classList.add('active');

        // Update slider min/max/value based on new currency
        const newRanges = getSliderRanges(curr.code);
        slider.min = newRanges.min;
        slider.max = newRanges.max;
        slider.step = newRanges.step;
        
        // Set new default
        slider.value = newRanges.def;
        state.packCost = newRanges.def;
        state.answers[idx] = newRanges.def;
        
        valueBubble.innerText = `${state.currencySymbol}${newRanges.def}`;
        minLabel.innerText = `Min: ${state.currencySymbol}${newRanges.min}`;
        maxLabel.innerText = `Max: ${state.currencySymbol}${newRanges.max}`;

        // Sync with dev sidebar cost field
        document.getElementById('calc-cost').value = newRanges.def;
        
        recalculateDynamicValues();
      };

      pillRow.appendChild(pill);
    });

    container.appendChild(pillRow);

    // Slider wrapper
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'quest-input-wrapper mt-20';

    const valueBubble = document.createElement('div');
    valueBubble.className = 'slider-val-bubble';
    valueBubble.innerText = `${state.currencySymbol}${currentCostVal}`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'quest-range-slider';
    slider.min = ranges.min;
    slider.max = ranges.max;
    slider.step = ranges.step;
    slider.value = currentCostVal;

    slider.oninput = () => {
      const cost = Number(slider.value);
      valueBubble.innerText = `${state.currencySymbol}${cost}`;
      state.answers[idx] = cost;
      state.packCost = cost;
      
      // Update dev sidebar Cost field
      document.getElementById('calc-cost').value = cost;
      
      recalculateDynamicValues();
    };

    sliderContainer.appendChild(valueBubble);
    sliderContainer.appendChild(slider);

    // Min-Max labels
    const minMaxLabelRow = document.createElement('div');
    minMaxLabelRow.className = 'input-slider-label-row';
    
    const minLabel = document.createElement('span');
    minLabel.innerText = `Min: ${state.currencySymbol}${ranges.min}`;
    
    const maxLabel = document.createElement('span');
    maxLabel.innerText = `Max: ${state.currencySymbol}${ranges.max}`;

    minMaxLabelRow.appendChild(minLabel);
    minMaxLabelRow.appendChild(maxLabel);
    sliderContainer.appendChild(minMaxLabelRow);

    container.appendChild(sliderContainer);
    elOptionsContainer.appendChild(container);
  } else if (questionObj.type === 'select') {
    const isMulti = questionObj.isMultiSelect === true;
    
    // Initialize array if multi-select
    if (isMulti && !Array.isArray(state.answers[idx])) {
      state.answers[idx] = currentAnswer ? [currentAnswer] : [];
    }

    questionObj.options.forEach(opt => {
      const card = document.createElement('div');
      
      const isActive = isMulti 
        ? (state.answers[idx].includes(opt))
        : (currentAnswer === opt);

      card.className = `option-card ${isActive ? 'active' : ''}`;
      
      card.onclick = () => {
        if (isMulti) {
          if (questionObj.id === 29) {
            if (opt === "No, I haven’t used anything yet") {
              // Select ONLY this option, deselecting all others
              state.answers[idx] = ["No, I haven’t used anything yet"];
              const siblingCards = elOptionsContainer.querySelectorAll('.option-card');
              siblingCards.forEach(s => s.classList.remove('active'));
              card.classList.add('active');
              return;
            } else {
              // Deselect "No, I haven’t used anything yet" if it was active
              const noneIdx = state.answers[idx].indexOf("No, I haven’t used anything yet");
              if (noneIdx > -1) {
                state.answers[idx].splice(noneIdx, 1);
                // Remove active class from the "No, I haven't..." card
                const siblingCards = elOptionsContainer.querySelectorAll('.option-card');
                siblingCards.forEach(s => {
                  const lbl = s.querySelector('.option-label');
                  if (lbl && lbl.innerText.trim() === "No, I haven’t used anything yet") {
                    s.classList.remove('active');
                  }
                });
              }
            }
          }

          const index = state.answers[idx].indexOf(opt);
          if (index > -1) {
            state.answers[idx].splice(index, 1);
            card.classList.remove('active');
          } else {
            const maxSel = questionObj.maxSelect || 999;
            if (state.answers[idx].length >= maxSel) {
              alert(`You can select a maximum of ${maxSel} options.`);
              return;
            }
            state.answers[idx].push(opt);
            card.classList.add('active');
          }
        } else {
          // Remove active class from sibling cards
          const siblings = elOptionsContainer.querySelectorAll('.option-card');
          siblings.forEach(s => s.classList.remove('active'));
          
          card.classList.add('active');
          state.answers[idx] = opt;
          
          // Auto-advance single choice options
          setTimeout(() => {
            handleQuestionNext();
          }, 300);
        }
      };

      card.innerHTML = `
        <span class="option-label">${opt}</span>
        <span class="option-check"></span>
      `;
      elOptionsContainer.appendChild(card);
    });

    // Special footer link for Question 7 & Question 26
    if (questionObj.id === 7 || questionObj.id === 26) {
      const linkDiv = document.createElement('div');
      linkDiv.className = 'why-we-ask-link-container';
      linkDiv.innerHTML = `
        <span class="why-we-ask-link" onclick="showWhyWeAskModal(${questionObj.id})">Why do we ask?</span>
      `;
      elOptionsContainer.appendChild(linkDiv);
    }
  } else if (questionObj.type === 'text') {
    const val = currentAnswer !== undefined ? currentAnswer : '';
    
    if (state.answers[idx] === undefined) {
      state.answers[idx] = val;
    }

    const textWrapper = document.createElement('div');
    textWrapper.className = 'quest-input-wrapper';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'large-stat-input';
    input.placeholder = questionObj.placeholder || 'Type here...';
    input.value = val;
    
    input.oninput = () => {
      state.answers[idx] = input.value;
      
      // Update name variables in real time
      if (questionObj.id === 1) {
        state.userName = input.value || 'Siddhi';
        document.getElementById('calc-name').value = state.userName;
      }
    };
    
    textWrapper.appendChild(input);
    elOptionsContainer.appendChild(textWrapper);
  } else if (questionObj.type === 'slider') {
    // Number selection using standard sliders
    const val = currentAnswer !== undefined ? currentAnswer : questionObj.defaultValue;
    
    // Save current default if no selection made
    if (state.answers[idx] === undefined) {
      state.answers[idx] = val;
    }

    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'quest-input-wrapper';

    const valueBubble = document.createElement('div');
    valueBubble.className = 'slider-val-bubble';
    valueBubble.innerText = `${val} ${questionObj.unit}`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'quest-range-slider';
    slider.min = questionObj.min;
    slider.max = questionObj.max;
    slider.step = questionObj.step || 1;
    slider.value = val;

    slider.oninput = () => {
      valueBubble.innerText = `${slider.value} ${questionObj.unit}`;
      state.answers[idx] = Number(slider.value);
      
      // Update variables in real time for calculations
      if (questionObj.id === 9) {
        state.cigarettesPerDay = Number(slider.value);
        document.getElementById('calc-qty').value = slider.value;
      } else if (questionObj.id === 10) {
        state.packCost = Number(slider.value);
        document.getElementById('calc-cost').value = slider.value;
      } else if (questionObj.id === 11) {
        state.yearsSmoked = Number(slider.value);
        document.getElementById('calc-years').value = slider.value;
      } else if (questionObj.id === 12) {
        state.minutesPerCigarette = Number(slider.value);
      }
      recalculateDynamicValues();
    };

    sliderWrapper.appendChild(valueBubble);
    sliderWrapper.appendChild(slider);

    const minMaxLabelRow = document.createElement('div');
    minMaxLabelRow.className = 'input-slider-label-row';
    minMaxLabelRow.innerHTML = `
      <span>Min: ${questionObj.min}</span>
      <span>Max: ${questionObj.max}</span>
    `;
    sliderWrapper.appendChild(minMaxLabelRow);

    elOptionsContainer.appendChild(sliderWrapper);
  }
}

// Questionnaire navigation
function startQuestionnaire(startIndex = 1) {
  state.onboardingActive = true;
  state.currentQuestionIndex = startIndex;
  state.questionHistory = [];
  
  // Initialize history
  for (let i = 1; i < startIndex; i++) {
    state.questionHistory.push(i);
  }
  
  jumpToScreen('questionnaire');
  renderQuestionIndex(startIndex);
}

function handleQuestionNext() {
  const curIdx = state.currentQuestionIndex;
  
  // Confirm they made a selection (otherwise use default values)
  if (state.answers[curIdx] === undefined) {
    const qObj = onboardingQuestions[curIdx - 1];
    if (qObj.type === 'select') {
      state.answers[curIdx] = qObj.isMultiSelect ? [] : qObj.options[0];
    } else {
      state.answers[curIdx] = qObj.defaultValue;
    }
  }

  // Check if we need to show reality check / testimonial insights!
  // We place:
  // - Pillars Interstitial after Q5 (before Q6)
  // - Financial insight between Q10 & Q11
  // - Testimonial card between Q19 & Q20
  if (curIdx === 5) {
    state.questionHistory.push(curIdx);
    jumpToScreen('pillars-interstitial');
    return;
  }
  
  if (curIdx === 12) {
    state.questionHistory.push(curIdx);
    recalculateDynamicValues();
    jumpToScreen('insight-spent');
    return;
  }
  
  if (curIdx === 21) {
    state.questionHistory.push(curIdx);
    jumpToScreen('testimonial-interstitial');
    return;
  }

  if (curIdx < onboardingQuestions.length) {
    state.questionHistory.push(curIdx);
    state.currentQuestionIndex++;
    renderQuestionIndex(state.currentQuestionIndex);
  } else {
    // Finished questionnaire! Trigger loading transition.
    state.onboardingActive = false;
    triggerPlanLoading();
  }
}

function handleQuestionBack() {
  if (state.questionHistory.length > 0) {
    const prevIdx = state.questionHistory.pop();
    state.currentQuestionIndex = prevIdx;
    renderQuestionIndex(prevIdx);
  } else {
    // Exit questionnaire back to intro
    jumpToScreen('questionnaire-intro');
  }
}

function resumeQuestionnaireAfterTestimonial() {
  state.currentQuestionIndex = 22;
  jumpToScreen('questionnaire');
  renderQuestionIndex(22);
}

function resumeQuestionnaireAfterPillars() {
  state.currentQuestionIndex = 6;
  jumpToScreen('questionnaire');
  renderQuestionIndex(6);
}

function goBackFromPillars() {
  state.currentQuestionIndex = 5;
  jumpToScreen('questionnaire');
  renderQuestionIndex(5);
}

// --- Loading Plan Animation Ticker ---
function triggerPlanLoading() {
  jumpToScreen('loading');
  recalculateDynamicValues();
  
  const elBar = document.getElementById('loading-bar-fill');
  const elTicker = document.getElementById('loading-ticker');
  const check1 = document.getElementById('check-item-1');
  const check2 = document.getElementById('check-item-2');
  const check3 = document.getElementById('check-item-3');

  const tickerMsgs = [
    "Analysing your smoking patterns...",
    "Understanding your triggers...",
    "Calculating potential health gains...",
    "Creating your 30-day customized roadmap...",
    "Tailoring support models to your goals..."
  ];

  let progress = 0;
  elBar.style.width = '0%';
  check1.classList.remove('done');
  check2.classList.remove('done');
  check3.classList.remove('done');

  // Pulse ring animation
  const interval = setInterval(() => {
    progress += 2.5;
    elBar.style.width = `${progress}%`;

    // Rotate ticker messages
    const tickerIndex = Math.floor((progress / 100) * tickerMsgs.length);
    if (tickerMsgs[tickerIndex] && elTicker) {
      elTicker.innerText = tickerMsgs[tickerIndex];
    }

    // Check off tasks sequentially
    if (progress >= 30) check1.classList.add('done');
    if (progress >= 60) check2.classList.add('done');
    if (progress >= 85) check3.classList.add('done');

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        jumpToScreen('offer');
      }, 500);
    }
  }, 100);
}

// --- Screen Router ---
function jumpToScreen(screenId) {
  // First time Community check
  if (screenId === 'community' && !state.communityNameChosen) {
    openCommunityWelcomeModal();
    return;
  }

  state.currentScreenId = screenId;
  
  // Hide all screens
  const screens = document.querySelectorAll('.screen-view');
  screens.forEach(s => s.classList.remove('active'));

  // Show target screen
  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.add('active');
    
    // Auto-scroll inside phone simulator view to top when changing screens
    target.scrollTop = 0;
  }

  // Toggle Create Post FAB (Only visible on community screen in 'posts' tab)
  const fab = document.getElementById('create-post-fab');
  if (fab) {
    if (screenId === 'community' && (!state.activeCommunityMainTab || state.activeCommunityMainTab === 'posts')) {
      fab.style.display = 'flex';
    } else {
      fab.style.display = 'none';
    }
  }

  // Load correct view dynamically if navigating to community circle
  if (screenId === 'community') {
    if (state.activeCommunityMainTab === 'chat') {
      renderCommunityChatMessages();
    } else {
      renderCommunityPosts();
    }
  } else if (screenId === 'tracker') {
    updateTrackerRealtimeStats();
    if (window.renderTrackerInsights) {
      window.renderTrackerInsights();
    }
  }

  // Update control panel active jumper button
  const jumperBtns = document.querySelectorAll('.jump-btn');
  jumperBtns.forEach(btn => {
    btn.classList.remove('active');
    // Match button action parameter
    if (btn.getAttribute('onclick').includes(`'${screenId}'`)) {
      btn.classList.add('active');
    }
  });

  // Sync inputs if navigating to home/dashboard
  if (screenId === 'home') {
    const greetingEl = document.getElementById('dash-greeting');
    if (greetingEl) {
      greetingEl.innerText = `Good morning, ${state.userName}`;
    }
    triggerHomeTypewriter();
  } else if (screenId === 'profile') {
    const nameEl = document.getElementById('profile-user-name');
    if (nameEl) nameEl.innerText = state.userName;
    
    const langEl = document.getElementById('profile-lang-display');
    if (langEl) {
      const langNames = { en: 'English', hi: 'हिन्दी', mr: 'मराठी', gu: 'ગુજરાતી', fr: 'Français', de: 'Deutsch', it: 'Italiano', es: 'Español' };
      langEl.innerText = langNames[state.language] || 'English';
    }
  }

  // If opening settings, check dark mode checkbox
  if (screenId === 'settings') {
    const checkEl = document.getElementById('settings-dark-mode-toggle');
    if (checkEl) checkEl.checked = state.appTheme === 'dark';
  }
}

// --- Sidebar Control Panel Sync ---
function updateCalculatorInputs() {
  const nameVal = document.getElementById('calc-name').value;
  const qtyVal = Number(document.getElementById('calc-qty').value);
  const costVal = Number(document.getElementById('calc-cost').value);
  const yearsVal = Number(document.getElementById('calc-years').value);

  state.userName = nameVal || 'Siddhi';
  state.cigarettesPerDay = qtyVal || 15;
  state.packCost = costVal || 12.00;
  state.yearsSmoked = yearsVal || 8;

  // Sync values into questionnaire inputs in case we are on them
  state.answers[1] = state.userName;
  state.answers[9] = state.cigarettesPerDay;
  state.answers[10] = state.packCost;
  state.answers[11] = state.yearsSmoked;
  state.answers[12] = state.minutesPerCigarette;

  // Redraw name question input dynamically if active on Name screen
  if (state.onboardingActive && state.currentQuestionIndex === 1) {
    renderQuestionIndex(1);
  }

  recalculateDynamicValues();

  // If currently displaying dashboard or profile, refresh values immediately
  const greetingEl = document.getElementById('dash-greeting');
  if (greetingEl) greetingEl.innerText = `Good morning, ${state.userName}`;

  const profileNameEl = document.getElementById('profile-user-name');
  if (profileNameEl) profileNameEl.innerText = state.userName;
}

// --- Language Controller ---
function changeWelcomeLanguage() {
  const select = document.getElementById('language-select');
  state.language = select.value;
  
  const translations = {
    en: {
      title: "Congratulations,<br>your quit journey begins.",
      sub: "You have taken the first step toward reclaiming your health, energy, and freedom."
    },
    hi: {
      title: "बधाई हो,<br>आपकी धूम्रपान छोड़ने की यात्रा शुरू होती है।",
      sub: "आपने अपने स्वास्थ्य, ऊर्जा और स्वतंत्रता को पुनः प्राप्त करने की दिशा में पहला कदम उठाया है।"
    },
    mr: {
      title: "अभिनंदन,<br>तुमचा धूम्रपान सोडण्याचा प्रवास सुरू होत आहे.",
      sub: "तुम्ही तुमचे आरोग्य, ऊर्जा आणि स्वातंत्र्य परत मिळवण्याच्या दिशेने पहिले पाऊल टाकले आहे."
    },
    gu: {
      title: "અભિનંદન,<br>તમારી ધૂમ્રપાન છોડવાની સફર શરૂ થાય છે.",
      sub: "તમે તમારા સ્વાસ્થ્ય, ઊર્જા અને સ્વતંત્રતાને પુનઃપ્રાપ્ત કરવા તરફ પ્રથમ પગલું ભર્યું છે."
    },
    fr: {
      title: "Félicitations,<br>votre voyage sans tabac commence.",
      sub: "Vous avez fait le premier pas pour récupérer votre santé, votre énergie et votre liberté."
    },
    de: {
      title: "Herzlichen Glückwunsch,<br>Ihr rauchfreier Weg beginnt.",
      sub: "Sie haben den ersten Schritt getan, um Ihre Gesundheit, Energie und Freiheit zurückzugewinnen."
    },
    it: {
      title: "Congratulazioni,<br>inizia il tuo percorso per smettere.",
      sub: "Hai fatto il primo passo per reclamare la tua salute, energia e libertà."
    },
    es: {
      title: "Felicitaciones,<br>comienza tu viaje para dejar de fumar.",
      sub: "Has dado el primer paso para reclamar tu salud, energía y libertad."
    }
  };

  const currentTrans = translations[state.language] || translations['en'];
  
  // Welcome screen 1 text change
  const welcomeTitle = document.querySelector('#screen-welcome-1 .welcome-title');
  const welcomeSubtitle = document.querySelector('#screen-welcome-1 .welcome-subtitle');
  if (welcomeTitle) welcomeTitle.innerHTML = currentTrans.title;
  if (welcomeSubtitle) welcomeSubtitle.innerText = currentTrans.sub;
}

// --- Global Theme Controller ---
function setAppTheme(theme) {
  state.appTheme = theme;
  
  // Update document theme attribute
  document.documentElement.setAttribute('data-theme', theme);

  // Toggle active button style in sidebar
  const lightBtn = document.getElementById('toggle-light');
  const darkBtn = document.getElementById('toggle-dark');
  
  if (theme === 'dark') {
    lightBtn.classList.remove('active');
    darkBtn.classList.add('active');
  } else {
    darkBtn.classList.remove('active');
    lightBtn.classList.add('active');
  }

  // Update settings toggle if open
  const settingsToggle = document.getElementById('settings-dark-mode-toggle');
  if (settingsToggle) settingsToggle.checked = theme === 'dark';
}

function handleSettingsThemeToggle(checkbox) {
  setAppTheme(checkbox.checked ? 'dark' : 'light');
}

// --- Program Paywall Gating & Locked Modules ---
function setProgramAccess(hasPaid) {
  state.hasPaid = hasPaid;

  const unlockCta = document.getElementById('home-unlock-smono-cta');
  if (unlockCta) {
    unlockCta.style.display = hasPaid ? 'none' : 'flex';
  }
  
  const unpaidToggle = document.getElementById('toggle-unpaid');
  const paidToggle = document.getElementById('toggle-paid');
  
  if (hasPaid) {
    unpaidToggle.classList.remove('active');
    paidToggle.classList.add('active');
  } else {
    paidToggle.classList.remove('active');
    unpaidToggle.classList.add('active');
  }

  // Refresh lock indicators on timeline selector cards
  refreshTimelineLockStyles();
  
  const modGate3 = document.getElementById('mod-gate-3');

  if (hasPaid) {
    if (modGate3) modGate3.classList.remove('locked-card-preview');
    
    // Remove lock checkbox styles
    const checkRef = document.getElementById('check-reflection');
    if (checkRef && !state.day1ReflectionCompleted) {
      checkRef.innerHTML = '';
      checkRef.classList.remove('lock-checkbox');
    }
    
    // Update profile badges/tier label
    const badge = document.getElementById('profile-tier-badge');
    if (badge) {
      badge.innerText = "Smono Premium member";
      badge.style.background = "var(--color-green-soft)";
      badge.style.color = "var(--color-green-dark)";
    }
    
    const buyAction = document.getElementById('profile-purchase-action-label');
    const buyStatus = document.getElementById('profile-purchase-action-status');
    if (buyAction) buyAction.innerText = "⭐ Smono Premium Active";
    if (buyStatus) {
      buyStatus.innerText = "Lifetime Access";
      buyStatus.className = "item-value color-green";
    }
  } else {
    if (modGate3) modGate3.classList.add('locked-card-preview');
    
    // Restore lock checkbox styles
    const checkRef = document.getElementById('check-reflection');
    if (checkRef && !state.day1ReflectionCompleted) {
      checkRef.classList.add('lock-checkbox');
      checkRef.innerHTML = '<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm-3 5c0-1.66 1.34-3 3-3s3 1.34 3 3v3H9V7zm3 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>';
    }
    
    const badge = document.getElementById('profile-tier-badge');
    if (badge) {
      badge.innerText = "Smono Free Tier";
      badge.style.background = "var(--color-sky-soft)";
      badge.style.color = "#0369a1";
    }

    const buyAction = document.getElementById('profile-purchase-action-label');
    const buyStatus = document.getElementById('profile-purchase-action-status');
    if (buyAction) buyAction.innerText = "🔓 Buy Smono Premium";
    if (buyStatus) {
      buyStatus.innerText = "Get 60% Off";
      buyStatus.className = "item-value highlight-orange";
    }
  }
  
  // Refresh rendering of module cards to apply lock status changes
  renderDailyModules(state.selectedProgramDay || 1);
}

function handleLockedCardClick(dayNum) {
  const isAccessible = dayNum === 1 || 
                       dayNum <= state.maxUnlockedDay || 
                       (state.completedReflections && state.completedReflections[dayNum - 1]);
                       
  if (isAccessible || state.hasPaid) {
    state.selectedProgramDay = dayNum;
    
    // Update timeline day active states
    for (let d = 1; d <= 5; d++) {
      const card = document.getElementById(`day-${d}-card`);
      if (card) {
        if (d === dayNum) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      }
    }
    
    // Render dynamic module stack content
    renderDailyModules(dayNum);
    
    // Check if selected program day is <= 10 to show tracker widget
    const trackerWidget = document.getElementById('today-smoked-tracker-widget');
    if (trackerWidget) {
      if (dayNum <= 10) {
        trackerWidget.style.display = 'block';
      } else {
        trackerWidget.style.display = 'none';
      }
    }
  } else {
    // Open paywall modal
    const overlay = document.getElementById('paywall-modal-overlay');
    if (overlay) overlay.style.display = 'flex';
  }
}

function incrementTodaySmoked() {
  state.todaySmokedCount++;
  const el = document.getElementById('today-smoked-val');
  if (el) el.innerText = state.todaySmokedCount;

  state.dailySmokedLogs = state.dailySmokedLogs || {};
  state.dailySmokedLogs[state.selectedProgramDay || 1] = state.todaySmokedCount;

  updateTrackerRealtimeStats();
}

function decrementTodaySmoked() {
  if (state.todaySmokedCount > 0) {
    state.todaySmokedCount--;
    const el = document.getElementById('today-smoked-val');
    if (el) el.innerText = state.todaySmokedCount;

    state.dailySmokedLogs = state.dailySmokedLogs || {};
    state.dailySmokedLogs[state.selectedProgramDay || 1] = state.todaySmokedCount;

    updateTrackerRealtimeStats();
  }
}

window.incrementTodaySmoked = incrementTodaySmoked;
window.decrementTodaySmoked = decrementTodaySmoked;

function closePaywallModal() {
  const overlay = document.getElementById('paywall-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

function handlePaywallUnlockClick() {
  closePaywallModal();
  handlePurchaseSuccess();
}

function handlePaywallGatingOffer() {
  if (state.hasPaid) {
    alert("You have already purchased Smono Premium! Thank you for committing to your smoke-free life.");
  } else {
    jumpToScreen('offer');
  }
}

function handlePurchaseSuccess() {
  setProgramAccess(true);
  alert("Payment Successful! Welcome to Smono Premium. Your 30-day program has been unlocked.");
  jumpToScreen('home');
}

function handleDeclineOffer() {
  setProgramAccess(false);
  jumpToScreen('home');
}

function triggerObjectionHandling() {
  jumpToScreen('objection-survey');
}

// --- Auth flows simulated callbacks ---
function handleSendOTP() {
  const phone = document.getElementById('login-phone').value;
  const phoneDisplay = document.getElementById('otp-phone-display');
  
  if (phoneDisplay) {
    phoneDisplay.innerText = `+91 ${phone || '98765 43210'}`;
  }
  
  jumpToScreen('otp');
}

function handleVerifyOTP() {
  jumpToScreen('notifications');
}

function handleSocialLogin(platform) {
  alert(`Connecting securely with ${platform}...`);
  jumpToScreen('notifications');
}

function handleNotificationsOptIn(optIn) {
  if (optIn) {
    alert("Push Notifications Enabled! Smono will send you daily motivational reminders.");
  }
  // Route to the questionnaire intro screen first
  jumpToScreen('questionnaire-intro');
}

function handleLogout() {
  state.answers = {};
  setProgramAccess(false);
  jumpToScreen('welcome-1');
}

function handleRestorePurchase() {
  alert("Restoring purchase receipt. Smono Premium successfully restored!");
  setProgramAccess(true);
  jumpToScreen('profile');
}

// --- SOS Panic audio player overlay ---
let sosTimerInterval;
function triggerSosAudio() {
  const overlay = document.getElementById('sos-player-overlay');
  const timer = document.getElementById('sos-countdown');
  
  if (overlay) overlay.style.display = 'flex';
  
  // Simulated audio counting down from 10 minutes
  let secondsRemaining = 600;
  if (timer) timer.innerText = "10:00";
  
  clearInterval(sosTimerInterval);
  sosTimerInterval = setInterval(() => {
    secondsRemaining--;
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    if (timer) {
      timer.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    if (secondsRemaining <= 0) {
      clearInterval(sosTimerInterval);
      closeSosAudio();
    }
  }, 1000);
}

function closeSosAudio() {
  const overlay = document.getElementById('sos-player-overlay');
  if (overlay) overlay.style.display = 'none';
  clearInterval(sosTimerInterval);
}

// --- System Clock Tick ---
function updateIosTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  
  // Format as HH:MM
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  const elTime = document.getElementById('ios-time');
  if (elTime) elTime.innerText = `${hours}:${minutes}`;
}

// --- "Why we ask" Custom Bottom Sheet Modal ---
function showWhyWeAskModal(questionId) {
  if (document.getElementById('why-we-ask-modal')) return;

  let title = "Why we ask";
  let desc = "We’ll keep your deeper reasons in mind while building your program. When motivation dips, Smono will remind you why this matters to you.";

  if (questionId === 7) {
    desc = "Smoking often attaches itself to ordinary moments. Once we know your trigger moments, Smono can help you practise new responses for each one.";
  }

  const modal = document.createElement('div');
  modal.id = 'why-we-ask-modal';
  modal.className = 'bottom-sheet-modal active';
  modal.innerHTML = `
    <div class="bottom-sheet-backdrop" onclick="closeWhyWeAskModal()"></div>
    <div class="bottom-sheet-content glass-card">
      <div class="bottom-sheet-drag-handle"></div>
      <h3 class="bottom-sheet-title">${title}</h3>
      <p class="bottom-sheet-desc">${desc}</p>
      <button class="btn btn-primary w-full mt-20" onclick="closeWhyWeAskModal()">GOT IT</button>
    </div>
  `;
  
  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);
}

window.showWhyWeAskModal = showWhyWeAskModal;
window.closeWhyWeAskModal = () => {
  const modal = document.getElementById('why-we-ask-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
};

// --- Profile Support Menu Interactive Handlers ---
function handleProfileChatWithCoach() {
  if (document.getElementById('coach-chat-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'coach-chat-modal';
  modal.className = 'bottom-sheet-modal active';
  modal.innerHTML = `
    <div class="bottom-sheet-backdrop" onclick="closeCoachChatModal()"></div>
    <div class="bottom-sheet-content glass-card coach-chat-content" style="height: 80%; max-height: 480px; display: flex; flex-direction: column; padding-bottom: 20px;">
      <div class="bottom-sheet-drag-handle"></div>
      
      <!-- Header -->
      <div class="coach-header">
        <div class="avatar-small"></div>
        <div class="coach-info">
          <span class="coach-name">Coach Aria</span>
          <span class="coach-status">● Online</span>
        </div>
        <button class="close-chat-btn" onclick="closeCoachChatModal()">✕</button>
      </div>
      
      <!-- Message List -->
      <div class="coach-messages-list" id="coach-messages-list">
        <div class="msg bubble-coach">
          Hi ${state.userName}! I'm Aria, your personal Smono coach. How is your quit journey going today?
        </div>
      </div>

      <!-- Input Box -->
      <div class="coach-chat-input-row">
        <input type="text" id="coach-chat-input" placeholder="Message Coach Aria..." onkeydown="if(event.key==='Enter') sendCoachChatMessage()" />
        <button class="coach-send-btn" onclick="sendCoachChatMessage()">Send</button>
      </div>
    </div>
  `;
  
  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);
}

window.sendCoachChatMessage = () => {
  const input = document.getElementById('coach-chat-input');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  const list = document.getElementById('coach-messages-list');
  if (!list) return;

  // Append User message
  const userMsg = document.createElement('div');
  userMsg.className = 'msg bubble-user';
  userMsg.innerText = text;
  list.appendChild(userMsg);
  list.scrollTop = list.scrollHeight;

  // Coach typing...
  const typingMsg = document.createElement('div');
  typingMsg.className = 'msg bubble-coach typing-indicator';
  typingMsg.innerText = 'Aria is typing...';
  list.appendChild(typingMsg);
  list.scrollTop = list.scrollHeight;

  // Coach reply
  const coachReplies = [
    "That's a normal hurdle. The key is to replace the trigger loop (e.g. coffee) with a new habit. What could you do instead of smoking?",
    "I hear you. Cravings peak within 5 minutes. Try taking 3 slow deep breaths right now.",
    "Reclaiming your health is a day-by-day practice. Smono's neural modules will guide you through this peak.",
    "Remember why you started Smono. Your family and your savings are worth every craving you conquer today!",
    "Slips are part of the journey. Be extra kind to yourself today and focus on the next hour."
  ];

  setTimeout(() => {
    typingMsg.remove();
    const reply = document.createElement('div');
    reply.className = 'msg bubble-coach';
    reply.innerText = coachReplies[Math.floor(Math.random() * coachReplies.length)];
    list.appendChild(reply);
    list.scrollTop = list.scrollHeight;
  }, 1200);
};

window.closeCoachChatModal = () => {
  const modal = document.getElementById('coach-chat-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
};

function handleProfileSendEmail() {
  if (document.getElementById('email-support-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'email-support-modal';
  modal.className = 'bottom-sheet-modal active';
  modal.innerHTML = `
    <div class="bottom-sheet-backdrop" onclick="closeEmailSupportModal()"></div>
    <div class="bottom-sheet-content glass-card" style="padding-bottom: 25px;">
      <div class="bottom-sheet-drag-handle"></div>
      <h3 class="bottom-sheet-title">Email Smono Support</h3>
      <p class="bottom-sheet-desc">Have a question or billing inquiry? Send us a line directly. We typically reply in under 2 hours.</p>
      
      <div class="email-details-box mt-15" style="background:var(--color-bg-card); border:1px solid var(--color-border-glass); border-radius:12px; padding:15px; text-align:center; font-family:var(--font-header); font-size:16px;">
        <strong>support@smono.co</strong>
      </div>
      
      <a href="mailto:support@smono.co" class="btn btn-primary w-full mt-20 text-center" style="display:block; text-decoration:none;" onclick="closeEmailSupportModal()">Open Mail App</a>
    </div>
  `;
  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);
}

window.closeEmailSupportModal = () => {
  const modal = document.getElementById('email-support-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
};

function handleProfileHowToDoProgram() {
  if (document.getElementById('program-guide-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'program-guide-modal';
  modal.className = 'bottom-sheet-modal active';
  modal.innerHTML = `
    <div class="bottom-sheet-backdrop" onclick="closeProgramGuideModal()"></div>
    <div class="bottom-sheet-content glass-card" style="padding-bottom: 25px;">
      <div class="bottom-sheet-drag-handle"></div>
      <h3 class="bottom-sheet-title">Smono Program Guide</h3>
      <p class="bottom-sheet-desc">How to get the most out of Smono:</p>

      <div class="guide-steps-container mt-15" style="display:flex; flex-direction:column; gap:12px;">
        <div class="guide-step" style="display:flex; gap:12px; align-items:flex-start;">
          <div class="step-num" style="background:var(--color-accent-sky); color:#fff; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; flex-shrink:0;">1</div>
          <div class="step-text" style="font-size:12px; line-height:1.4; color:var(--color-text-secondary);">
            <strong style="color:var(--color-text-primary); display:block; margin-bottom:2px;">Daily 5-Min Modules:</strong> Every morning Smono unlocks a cognitive rewiring lesson designed around your triggers.
          </div>
        </div>
        <div class="guide-step" style="display:flex; gap:12px; align-items:flex-start;">
          <div class="step-num" style="background:var(--color-accent-sky); color:#fff; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; flex-shrink:0;">2</div>
          <div class="step-text" style="font-size:12px; line-height:1.4; color:var(--color-text-secondary);">
            <strong style="color:var(--color-text-primary); display:block; margin-bottom:2px;">Cravings SOS:</strong> Hit the red alert button on the dashboard to access instant neural-calming tools during peak urges.
          </div>
        </div>
        <div class="guide-step" style="display:flex; gap:12px; align-items:flex-start;">
          <div class="step-num" style="background:var(--color-accent-sky); color:#fff; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:12px; flex-shrink:0;">3</div>
          <div class="step-text" style="font-size:12px; line-height:1.4; color:var(--color-text-secondary);">
            <strong style="color:var(--color-text-primary); display:block; margin-bottom:2px;">Trigger Logs:</strong> Regularly logging trigger episodes helps Smono rebuild and customize daily strategies.
          </div>
        </div>
      </div>

      <button class="btn btn-primary w-full mt-20" onclick="closeProgramGuideModal()">GOT IT</button>
    </div>
  `;
  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);
}

window.closeProgramGuideModal = () => {
  const modal = document.getElementById('program-guide-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
};

function handleProfileFAQ() {
  if (document.getElementById('faq-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'faq-modal';
  modal.className = 'bottom-sheet-modal active';
  modal.innerHTML = `
    <div class="bottom-sheet-backdrop" onclick="closeFaqModal()"></div>
    <div class="bottom-sheet-content glass-card" style="height: 80%; max-height: 480px; display: flex; flex-direction: column; padding-bottom: 20px;">
      <div class="bottom-sheet-drag-handle"></div>
      <h3 class="bottom-sheet-title">Frequently Asked Questions</h3>
      
      <div class="faq-scroll-area mt-10" style="overflow-y: auto; flex-grow: 1; padding-right: 2px; display:flex; flex-direction:column; gap:15px;">
        <div class="faq-item">
          <strong class="faq-q" style="font-size:13px; color:var(--color-text-primary); display:block; margin-bottom:4px;">Is Smono completely drug-free?</strong>
          <p class="faq-a" style="font-size:12px; line-height:1.4; color:var(--color-text-secondary);">Yes. Smono operates on Cognitive Behavior Therapy (CBT) and Neural Retraining to rewrite behavior patterns without nicotine gums, patches, or pills.</p>
        </div>
        <div class="faq-item">
          <strong class="faq-q" style="font-size:13px; color:var(--color-text-primary); display:block; margin-bottom:4px;">What if I slip up and smoke?</strong>
          <p class="faq-a" style="font-size:12px; line-height:1.4; color:var(--color-text-secondary);">Slips are lessons, not failures. Smono does NOT reset your streak back to zero; instead, Smono encourages focus on trigger replacement rather than shame.</p>
        </div>
        <div class="faq-item">
          <strong class="faq-q" style="font-size:13px; color:var(--color-text-primary); display:block; margin-bottom:4px;">How long does Smono take?</strong>
          <p class="faq-a" style="font-size:12px; line-height:1.4; color:var(--color-text-secondary);">The core program runs for 30 consecutive days, with daily modules taking only 5 minutes.</p>
        </div>
        <div class="faq-item">
          <strong class="faq-q" style="font-size:13px; color:var(--color-text-primary); display:block; margin-bottom:4px;">Can I request a refund?</strong>
          <p class="faq-a" style="font-size:12px; line-height:1.4; color:var(--color-text-secondary);">Yes, we back your journey with a 14-Day Refund Guarantee. Just drop us an email if Smono doesn't feel right for you.</p>
        </div>
      </div>

      <button class="btn btn-primary w-full mt-15" onclick="closeFaqModal()">GOT IT</button>
    </div>
  `;
  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);
}

window.closeFaqModal = () => {
  const modal = document.getElementById('faq-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
};

window.handleProfileChatWithCoach = handleProfileChatWithCoach;
window.handleProfileSendEmail = handleProfileSendEmail;
window.handleProfileHowToDoProgram = handleProfileHowToDoProgram;
window.handleProfileFAQ = handleProfileFAQ;

// --- Day 1 Modules Interactive Functions ---
let storyTimer = null;
let currentStorySlide = 0;
const totalStorySlides = 7;
const storyDuration = 9000; // 9 seconds per slide (more text)
let tickInterval = null;
let currentProgressVal = 0;

function openStoryViewer() {
  if (document.getElementById('story-viewer-modal')) return;
  
  currentStorySlide = 0;
  
  const modal = document.createElement('div');
  modal.id = 'story-viewer-modal';
  modal.className = 'story-viewer-overlay';
  modal.innerHTML = `
    <!-- Top segmented progress bar -->
    <div class="story-progress-bar">
      ${Array.from({ length: totalStorySlides }).map((_, i) => `
        <div class="story-progress-segment">
          <div class="story-progress-fill" id="story-progress-fill-${i}"></div>
        </div>
      `).join('')}
    </div>

    <!-- Header -->
    <div class="story-header">
      <div class="story-header-avatar">🧠</div>
      <div class="story-header-info">
        <span class="story-header-title">Day 1 — Seeing the Trap</span>
        <span class="story-header-subtitle">Smono Reset Method</span>
      </div>
      <button class="story-close-btn" onclick="closeStoryViewer()">✕</button>
    </div>

    <!-- Slide Navigation Areas -->
    <button class="story-nav-btn story-nav-left" onclick="navigateStory(-1)"></button>
    <button class="story-nav-btn story-nav-right" onclick="navigateStory(1)"></button>

    <!-- Body contents -->
    <div class="story-body" style="background: #ffffff;">
      
      <!-- Slide 1: Welcome Intro -->
      <div class="story-slide active" id="story-slide-0">
        <div style="display:flex; flex-direction:column; overflow-y:auto; height:100%; padding-right:4px;">
          <div style="font-size: 11px; font-weight: 800; color: var(--color-accent-sky); text-transform: uppercase; margin-bottom: 5px;">Smono Reset Method · The Program · Day 1 of 30</div>
          <h3 class="story-slide-title">Day 1 — Seeing the Trap</h3>
          <div style="background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); border-radius:10px; padding:10px; margin-bottom:12px; font-size:11px; font-weight:700; color:var(--color-accent-sky); line-height:1.4;">
            CBT technique in focus: Psychoeducation & functional analysis — before we change a behaviour, we map exactly what it is and what keeps it running.
          </div>
          <p class="story-slide-text" style="font-size:14px; font-weight:900; line-height:1.3; margin-bottom:10px; color:#0f172a;">You were never weak. You were fighting something you couldn't see.</p>
          <p class="story-slide-text" style="font-size:12.5px; opacity: 0.9; line-height:1.5;">Welcome to Day 1. Today has one job: to help you see clearly the trap you've been living inside. Not to lecture you, not to scare you — you already know the health facts, and they've never been enough. We're going to do something different. We're going to make the invisible visible.</p>
        </div>
      </div>

      <!-- Slide 2: Module 1 -->
      <div class="story-slide" id="story-slide-1">
        <div style="display:flex; flex-direction:column; overflow-y:auto; height:100%; padding-right:4px;">
          <div style="font-size: 10px; font-weight: 800; color: var(--color-accent-sky); text-transform: uppercase; margin-bottom: 3px;">Module 1</div>
          <h3 class="story-slide-title" style="font-size:22px; margin-bottom:10px;">Why every previous attempt failed</h3>
          <p class="story-slide-text" style="font-size:12px; opacity:0.9; line-height:1.45; margin-bottom:8px;">
            Be honest with yourself for a moment. You've probably tried to stop before. Maybe through sheer willpower. Maybe with patches, gum, or a vape. Maybe you lasted three days, three weeks, even three months — and then you were smoking again, often without quite knowing how.
          </p>
          <p class="story-slide-text" style="font-size:12px; opacity:0.9; line-height:1.45; margin-bottom:8px;">
            If part of you has started to believe you're simply "someone who can't quit," set that down. It isn't true, and by the end of these ten days you'll understand precisely why your past attempts had nothing to do with weakness.
          </p>
          <p class="story-slide-text" style="font-size:12px; opacity:0.9; line-height:1.45;">
            Here is the core problem. Every conventional method asks you to give up something you still secretly believe is valuable, while leaving that belief untouched. You white-knuckle through the craving, but the part of your mind that whispers "a cigarette would help right now" is still fully intact. Sooner or later, in a weak moment, that belief wins. You can't permanently walk away from something you still want. So we're not going to remove the cigarette first. We're going to remove the wanting.
          </p>
        </div>
      </div>

      <!-- Slide 3: Module 2 -->
      <div class="story-slide" id="story-slide-2">
        <div style="display:flex; flex-direction:column; overflow-y:auto; height:100%; padding-right:4px;">
          <div style="font-size: 10px; font-weight: 800; color: var(--color-accent-sky); text-transform: uppercase; margin-bottom: 3px;">Module 2</div>
          <h3 class="story-slide-title" style="font-size:22px; margin-bottom:10px;">What the trap actually is</h3>
          <p class="story-slide-text" style="font-size:12px; font-weight:900; color:var(--color-accent-sky); margin-bottom:8px; line-height:1.4;">
            This is the single most important idea in the whole method, so read it slowly: smoking does not give you anything. It takes something away, then briefly hands a small piece of it back — and you feel grateful for the return.
          </p>
          <p class="story-slide-text" style="font-size:12px; opacity:0.9; line-height:1.45; margin-bottom:8px;">
            A non-smoker doesn't walk around all day with a low, nagging emptiness that a cigarette relieves. They simply don't have the emptiness at all. Nicotine creates a small, restless discomfort as it leaves your body, and the next cigarette partially relieves the discomfort the previous cigarette caused. You feel that flicker of relief and call it pleasure or relaxation. But all that's happened is you've been returned, for a few minutes, to where the non-smoker lives permanently and for free.
          </p>
          <p class="story-slide-text" style="font-size:12px; opacity:0.9; line-height:1.45;">
            It's like wearing shoes a size too small all day just for the relief of taking them off. The relief is real — but you manufactured the discomfort in the first place. Once you truly see this, everything shifts. You stop feeling like you're sacrificing a pleasure, and start feeling like you're walking out of a con.
          </p>
        </div>
      </div>

      <!-- Slide 4: Module 3 -->
      <div class="story-slide" id="story-slide-3">
        <div style="display:flex; flex-direction:column; overflow-y:auto; height:100%; padding-right:4px;">
          <div style="font-size: 10px; font-weight: 800; color: var(--color-accent-sky); text-transform: uppercase; margin-bottom: 3px;">Module 3</div>
          <h3 class="story-slide-title" style="font-size:20px; margin-bottom:8px;">The denial that keeps the trap shut</h3>
          <p class="story-slide-text" style="font-size:12px; opacity:0.9; line-height:1.45; margin-bottom:8px;">
            Addiction protects itself by manufacturing denial — it convinces you that you're still in control of the very thing controlling you. You don't need to argue with me about any of this. Just read the four statements below and notice, quietly, which ones still have a grip on you:
          </p>
          <div class="story-poll-sticker" style="margin-top:5px; margin-bottom:8px;">
            <div class="story-poll-option" onclick="toggleStoryPollOption(this)" style="padding:8px 10px; font-size:11px;">"Smoking hasn't really harmed me."</div>
            <div class="story-poll-option" onclick="toggleStoryPollOption(this)" style="padding:8px 10px; font-size:11px;">"I don't smoke that much — it's under control."</div>
            <div class="story-poll-option" onclick="toggleStoryPollOption(this)" style="padding:8px 10px; font-size:11px;">"It genuinely helps me relax, focus, and be social."</div>
            <div class="story-poll-option" onclick="toggleStoryPollOption(this)" style="padding:8px 10px; font-size:11px;">"I could stop any time I really wanted to."</div>
          </div>
          <p class="story-slide-text" style="font-size:11px; opacity:0.8; line-height:1.4;">
            Don't try to talk yourself out of them today. Just mark which ones feel true. Over the coming days we'll take each one apart, and you'll watch it fall on its own.
          </p>
        </div>
      </div>

      <!-- Slide 5: Module 4 -->
      <div class="story-slide" id="story-slide-4">
        <div style="display:flex; flex-direction:column; overflow-y:auto; height:100%; padding-right:4px;">
          <div style="font-size: 10px; font-weight: 800; color: var(--color-accent-sky); text-transform: uppercase; margin-bottom: 3px;">Module 4</div>
          <h3 class="story-slide-title" style="font-size:20px; margin-bottom:10px;">Your first instruction (it will surprise you)</h3>
          <p class="story-slide-text" style="font-size:15px; font-weight:900; color:#f43f5e; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">
            Keep smoking today. Do not try to quit.
          </p>
          <p class="story-slide-text" style="font-size:12px; opacity:0.9; line-height:1.45;">
            This is a genuine instruction, not a figure of speech. For the next nine days you smoke or vape exactly as you normally would. Quitting today, on willpower, before you've seen the trap, is precisely the fight you've already lost before. We remove the desire first. When the desire is gone, putting the cigarette down isn't a battle — it's a relief.
          </p>
        </div>
      </div>

      <!-- Slide 6: Craving Tool -->
      <div class="story-slide" id="story-slide-5">
        <div style="display:flex; flex-direction:column; overflow-y:auto; height:100%; padding-right:4px;">
          <div style="font-size: 10px; font-weight: 800; color: var(--color-accent-sky); text-transform: uppercase; margin-bottom: 3px;">Craving Tool</div>
          <h3 class="story-slide-title" style="font-size:22px; margin-bottom:10px;">The Five-Second Pause</h3>
          <p class="story-slide-text" style="font-size:12.5px; opacity:0.9; line-height:1.5; margin-bottom:12px;">
            Every time today, before you light up, just pause and breathe once. You're still allowed to smoke. But that single pause breaks the automatic loop and hands the decision back to you.
          </p>
          <p class="story-slide-text" style="font-size:12.5px; opacity:0.9; line-height:1.5;">
            You're training a tiny gap between trigger and reaction — and that gap is where all your freedom will eventually live.
          </p>
        </div>
      </div>

      <!-- Slide 7: Tomorrow preview -->
      <div class="story-slide" id="story-slide-6">
        <div style="display:flex; flex-direction:column; overflow-y:auto; height:100%; padding-right:4px;">
          <div style="font-size: 10px; font-weight: 800; color: var(--color-accent-sky); text-transform: uppercase; margin-bottom: 3px;">Tomorrow Preview</div>
          <h3 class="story-slide-title" style="font-size:22px; margin-bottom:10px;">We open up the brain</h3>
          <p class="story-slide-text" style="font-size:13px; opacity:0.95; line-height:1.5; margin-bottom:15px;">
            Tomorrow: We open up the brain. You'll see exactly how nicotine creates the "little monster" — and why the relief it gives is the cleverest illusion in the trap.
          </p>
          <div class="story-footer-action">
            <button class="btn btn-primary w-full shadow-pulse" onclick="completeDay1Story()">Complete & Close</button>
          </div>
        </div>
      </div>

    </div>
  `;

  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);

  startStorySlideProgress();
}

function startStorySlideProgress() {
  clearInterval(tickInterval);
  currentProgressVal = 0;
  
  for (let i = 0; i < totalStorySlides; i++) {
    const el = document.getElementById(`story-progress-fill-${i}`);
    if (el) {
      el.style.width = i < currentStorySlide ? '100%' : '0%';
    }
  }

  const fillEl = document.getElementById(`story-progress-fill-${currentStorySlide}`);
  if (!fillEl) return;

  const stepMs = 100;
  const totalSteps = storyDuration / stepMs;
  
  tickInterval = setInterval(() => {
    currentProgressVal += (100 / totalSteps);
    if (fillEl) fillEl.style.width = `${Math.min(100, currentProgressVal)}%`;
    
    if (currentProgressVal >= 100) {
      clearInterval(tickInterval);
      if (currentStorySlide < totalStorySlides - 1) {
        navigateStory(1);
      }
    }
  }, stepMs);
}

function navigateStory(dir) {
  clearInterval(tickInterval);
  
  const curSlideEl = document.getElementById(`story-slide-${currentStorySlide}`);
  if (curSlideEl) curSlideEl.classList.remove('active');

  const curFill = document.getElementById(`story-progress-fill-${currentStorySlide}`);
  if (curFill) curFill.style.width = dir > 0 ? '100%' : '0%';

  currentStorySlide += dir;
  
  if (currentStorySlide < 0) currentStorySlide = 0;
  if (currentStorySlide >= totalStorySlides) currentStorySlide = totalStorySlides - 1;

  const newSlideEl = document.getElementById(`story-slide-${currentStorySlide}`);
  if (newSlideEl) newSlideEl.classList.add('active');

  startStorySlideProgress();
}

function toggleStoryPollOption(el) {
  el.classList.toggle('selected');
}

function closeStoryViewer() {
  clearInterval(tickInterval);
  const modal = document.getElementById('story-viewer-modal');
  if (modal) modal.remove();
}

function completeDay1Story() {
  closeStoryViewer();
  const currentDay = state.selectedProgramDay || 1;
  
  if (currentDay === 1) {
    state.day1LessonCompleted = true;
  }
  
  state.completedTasks = state.completedTasks || {};
  const checkboxId = currentDay === 1 ? 'check-lesson' : `check-lesson-${currentDay}`;
  state.completedTasks[checkboxId] = true;
  
  // Re-render currently selected modules stack
  renderDailyModules(currentDay);
  
  if (currentDay === 1) {
    alert("Awesome! You've completed the Day 1 Story Lesson. Now practice your 5-second pause and log your awareness details below!");
  } else {
    alert(`Awesome! You've completed the Day ${currentDay} Story Lesson.`);
  }
}

function openAwarenessLog() {
  if (document.getElementById('awareness-log-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'awareness-log-modal';
  modal.className = 'bottom-sheet-modal active';
  modal.innerHTML = `
    <div class="bottom-sheet-backdrop" onclick="closeAwarenessLog()"></div>
    <div class="bottom-sheet-content glass-card" style="height: 85%; max-height: 520px; display:flex; flex-direction:column; padding-bottom: 25px;">
      <div class="bottom-sheet-drag-handle"></div>
      
      <h3 class="bottom-sheet-title">The Awareness Log</h3>
      
      <div style="background: rgba(59,130,246,0.1); border: 1px solid var(--color-border-card); border-radius:10px; padding:10px; margin-bottom:12px; font-size:11px; color:var(--color-text-secondary); line-height:1.45; overflow-y:auto; max-height:120px;">
        <strong>Observer Instructions:</strong> For the rest of today, don't change anything about your smoking. Just observe it. Each time you reach for a cigarette or vape, pause five seconds before you light it and note three quick things: Time, Trigger, and Choice or reflex.
        <p style="margin-top:5px; margin-bottom:0; font-style:italic;">This is called a functional analysis in CBT: A (trigger) &rarr; B (behaviour) &rarr; C (what you got from it). Become a scientist studying your own pattern.</p>
      </div>
      
      <div class="awareness-form" style="display:flex; flex-direction:column; gap:12px; flex-grow:1; overflow-y:auto; padding-right:2px; margin-bottom:15px;">
        
        <!-- Field 1: Time -->
        <div>
          <label style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--color-text-secondary); display:block; margin-bottom:5px;">Time — when was it?</label>
          <input type="text" id="log-time" value="${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}" style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--color-border-card); background:var(--color-bg-card); color:var(--color-text-primary); font-size:13px; font-weight:600;" />
        </div>

        <!-- Field 2: Trigger (CBT A) -->
        <div>
          <label style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--color-text-secondary); display:block; margin-bottom:5px;">Trigger — what came just before?</label>
          <div style="display:flex; flex-wrap:wrap; gap:6px;" id="trigger-pills-container">
            ${['Coffee', 'Stress', 'Boredom', 'After Meals', 'Work Break', 'Socializing', 'Driving', 'Other'].map(trigger => `
              <span class="trigger-pill" onclick="selectTriggerPill(this)" style="background:var(--color-bg-card); border:1px solid var(--color-border-card); border-radius:20px; padding:6px 12px; font-size:11px; font-weight:700; color:var(--color-text-secondary); cursor:pointer; transition:all 0.2s;">${trigger}</span>
            `).join('')}
          </div>
        </div>

        <!-- Field 3: Reflex or Choice? -->
        <div>
          <label style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--color-text-secondary); display:block; margin-bottom:5px;">Choice or reflex?</label>
          <div style="display:flex; gap:10px;">
            <label style="flex-grow:1; display:flex; align-items:center; gap:8px; background:var(--color-bg-card); border:1px solid var(--color-border-card); border-radius:10px; padding:10px; font-size:12px; font-weight:700; cursor:pointer;">
              <input type="radio" name="reflex-choice" value="Reflex" checked style="accent-color:var(--color-accent-sky);" />
              Automatic reach
            </label>
            <label style="flex-grow:1; display:flex; align-items:center; gap:8px; background:var(--color-bg-card); border:1px solid var(--color-border-card); border-radius:10px; padding:10px; font-size:12px; font-weight:700; cursor:pointer;">
              <input type="radio" name="reflex-choice" value="Choice" style="accent-color:var(--color-accent-sky);" />
              Conscious decision
            </label>
          </div>
        </div>

      </div>

      <button class="btn btn-primary w-full" onclick="submitAwarenessLog()">Save Log Entry</button>
    </div>
  `;
  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);
}

function selectTriggerPill(el) {
  const pills = document.querySelectorAll('#trigger-pills-container .trigger-pill');
  pills.forEach(p => {
    p.style.background = 'var(--color-bg-card)';
    p.style.borderColor = 'var(--color-border-card)';
    p.style.color = 'var(--color-text-secondary)';
    p.classList.remove('selected');
  });
  el.style.background = 'var(--color-accent-sky)';
  el.style.borderColor = 'var(--color-accent-sky)';
  el.style.color = '#fff';
  el.classList.add('selected');
}

function closeAwarenessLog() {
  const modal = document.getElementById('awareness-log-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
}

function submitAwarenessLog() {
  closeAwarenessLog();
  const currentDay = state.selectedProgramDay || 1;
  
  if (currentDay === 1) {
    state.day1ExerciseCompleted = true;
  }
  
  state.completedTasks = state.completedTasks || {};
  const checkboxId = currentDay === 1 ? 'check-exercise' : `check-exercise-${currentDay}`;
  state.completedTasks[checkboxId] = true;

  // Increment Today I Smoked counter on home page as well!
  incrementTodaySmoked();

  // Re-render currently selected modules stack
  renderDailyModules(currentDay);

  alert("Awareness log saved successfully! Smono added 1 tracked cigarette to your dashboard logger.");
}

function handleReflectionCardClick() {
  if (state.hasPaid) {
    openReflectionModal();
  } else {
    // Open paywall modal
    const overlay = document.getElementById('paywall-modal-overlay');
    if (overlay) overlay.style.display = 'flex';
  }
}

function openReflectionModal() {
  if (document.getElementById('reflection-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'reflection-modal';
  modal.className = 'bottom-sheet-modal active';
  modal.innerHTML = `
    <div class="bottom-sheet-backdrop" onclick="closeReflectionModal()"></div>
    <div class="bottom-sheet-content glass-card" style="height: 85%; max-height: 520px; display:flex; flex-direction:column; padding-bottom: 25px;">
      <div class="bottom-sheet-drag-handle"></div>
      
      <h3 class="bottom-sheet-title">Evening Reflection</h3>
      <p class="bottom-sheet-desc" style="margin-bottom:10px;">Reflect on your history to remove the denial:</p>
      
      <div class="reflection-form" style="overflow-y:auto; flex-grow:1; display:flex; flex-direction:column; gap:14px; padding-right:2px; margin-bottom:15px;">
        
        <!-- Q1 -->
        <div>
          <label style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--color-text-secondary); display:block; margin-bottom:5px; line-height:1.3;">
            1. When did I have my very first cigarette or vape — and did I ever decide to do this every day for years?
          </label>
          <textarea id="ref-q1" placeholder="Write a few sentences..." style="width:100%; height:60px; padding:10px; border-radius:10px; border:1px solid var(--color-border-card); background:var(--color-bg-card); color:var(--color-text-primary); font-size:12px; font-weight:600; resize:none; outline:none; font-family:inherit;"></textarea>
        </div>

        <!-- Q2 -->
        <div>
          <label style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--color-text-secondary); display:block; margin-bottom:5px; line-height:1.3;">
            2. Which of the four denial statements still feels true to me, and why?
          </label>
          <textarea id="ref-q2" placeholder="Write a few sentences..." style="width:100%; height:60px; padding:10px; border-radius:10px; border:1px solid var(--color-border-card); background:var(--color-bg-card); color:var(--color-text-primary); font-size:12px; font-weight:600; resize:none; outline:none; font-family:inherit;"></textarea>
        </div>

        <!-- Q3 -->
        <div>
          <label style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--color-text-secondary); display:block; margin-bottom:5px; line-height:1.3;">
            3. How did it feel to pause for five seconds before smoking?
          </label>
          <textarea id="ref-q3" placeholder="Write a few sentences..." style="width:100%; height:60px; padding:10px; border-radius:10px; border:1px solid var(--color-border-card); background:var(--color-bg-card); color:var(--color-text-primary); font-size:12px; font-weight:600; resize:none; outline:none; font-family:inherit;"></textarea>
        </div>

      </div>

      <button class="btn btn-primary w-full" onclick="submitReflection()">Submit Reflection</button>
    </div>
  `;
  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);
}

function closeReflectionModal() {
  const modal = document.getElementById('reflection-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
}

function submitReflection() {
  closeReflectionModal();
  
  const currentDay = state.selectedProgramDay || 1;
  state.completedReflections = state.completedReflections || {};
  state.completedReflections[currentDay] = true;

  state.completedTasks = state.completedTasks || {};
  const checkboxId = currentDay === 1 ? 'check-reflection' : `check-reflection-${currentDay}`;
  state.completedTasks[checkboxId] = true;

  if (currentDay === state.maxUnlockedDay && state.maxUnlockedDay < 5) {
    state.maxUnlockedDay++;
    setUnlockedDayLimit(state.maxUnlockedDay);
    alert(`Congratulations! You've completed Day ${currentDay} and unlocked Day ${state.maxUnlockedDay}!`);
  } else {
    alert(`Day ${currentDay} reflection submitted successfully!`);
  }

  // Handle Day 1 complete modal and timer specifically
  if (currentDay === 1) {
    state.day1ReflectionCompleted = true;
    state.day1Completed = true;
    state.day2UnlockTime = Date.now() + (12 * 60 * 60 * 1000);
    showDay1CongratsModal();
  } else {
    renderDailyModules(currentDay);
  }
}

// --- Smono Circle Community Logic ---
state.communityPosts = [
  {
    id: 1,
    author: "Marcus K.",
    initials: "MK",
    gradient: "sky",
    journey: "Day 19 of the program",
    date: "Today",
    text: "Honestly, the Shoe Analogy blew my mind. I've spent years believing I was sacrificing a pleasure. Today, when I paused for 5 seconds before my mid-day smoke, I realized I was just trying to stop the nagging emptiness nicotine created. Wearing shoes too small just to take them off... Smono reset is real.",
    imageUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=500&auto=format&fit=crop&q=80",
    tags: ["success", "milestone", "tips"],
    likes: 28,
    liked: false,
    comments: 6,
    saved: false
  },
  {
    id: 2,
    author: "Sarah Jenkins",
    initials: "SJ",
    gradient: "rose",
    journey: "Newly smoke free",
    date: "Yesterday",
    text: "First morning coffee without a cigarette. I thought I would go crazy, but I practiced the 5-second pause and took 3 deep breaths. It passed in exactly 90 seconds. To anyone starting Day 1 today: trust the system, the cravings are just a paper tiger!",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80",
    tags: ["milestone", "success", "daily update"],
    likes: 42,
    liked: false,
    comments: 11,
    saved: false
  },
  {
    id: 3,
    author: "David Thorne",
    initials: "DT",
    gradient: "emerald",
    journey: "Smoke free for 90 days",
    date: "3 days ago",
    text: "Smono program finished 2 months ago and I haven't touched a single vape. The savings tracker shows $840 saved already. Buying that custom premium watch I always wanted as a reward today. Keep pushing guys, it gets so much easier.",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80",
    tags: ["success", "milestone", "tips"],
    likes: 87,
    liked: false,
    comments: 24,
    saved: false
  }
];

state.activeCommunityFilter = "all";
state.selectedNewPostTags = [];
state.selectedNewPostImage = "";

function renderCommunityPosts() {
  const container = document.getElementById('community-posts-container');
  if (!container) return;

  const filter = state.activeCommunityFilter || 'all';
  const filtered = filter === 'all' 
    ? state.communityPosts 
    : state.communityPosts.filter(p => p.tags.includes(filter));

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:var(--color-text-secondary);">
        <p style="font-size:14px; font-weight:800; margin-bottom:5px;">No posts yet in #${filter}</p>
        <p style="font-size:11px; margin:0;">Be the first to share an update by tapping the + button!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => `
    <div class="community-post-card">
      <!-- User Profile Row -->
      <div class="post-user-row">
        <div class="post-avatar avatar-${post.gradient}">${post.initials}</div>
        <div class="post-user-info">
          <div class="post-username-line">
            <span class="post-author-name">${post.author}</span>
            <span class="post-journey-badge">${post.journey}</span>
          </div>
          <span class="post-date-stamp">${post.date}</span>
        </div>
      </div>

      <!-- Post Body Text -->
      <p class="post-body-text">${post.text}</p>

      <!-- Post Image -->
      ${post.imageUrl ? `<img class="post-media-image" src="${post.imageUrl}" alt="Attachment" />` : ''}

      <!-- Tags List -->
      <div class="post-tags-list">
        ${post.tags.map(t => `<span class="post-hash-tag">#${t}</span>`).join('')}
      </div>

      <!-- Interactions Bar -->
      <div class="post-actions-bar">
        <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLikePost(${post.id})">
          <svg width="18" height="18" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>${post.likes}</span>
        </button>
        <button class="post-action-btn" onclick="commentPost(${post.id})">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>${post.comments}</span>
        </button>
        <button class="post-action-btn" onclick="sharePost(${post.id})">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 10.742l5.262-2.631m0 3.778l-5.262-2.631M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button class="post-action-btn post-save-btn ${post.saved ? 'saved' : ''}" onclick="toggleSavePost(${post.id})">
          <svg width="18" height="18" fill="${post.saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

function filterCommunityPosts(el, filterName) {
  state.activeCommunityFilter = filterName;
  const chips = document.querySelectorAll('.community-tag-chip');
  chips.forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  renderCommunityPosts();
}

function toggleLikePost(postId) {
  const post = state.communityPosts.find(p => p.id === postId);
  if (!post) return;
  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  renderCommunityPosts();
}

function toggleSavePost(postId) {
  const post = state.communityPosts.find(p => p.id === postId);
  if (!post) return;
  post.saved = !post.saved;
  renderCommunityPosts();
}

function commentPost(postId) {
  const commentText = prompt("Add a comment to this post:");
  if (commentText && commentText.trim() !== "") {
    const post = state.communityPosts.find(p => p.id === postId);
    if (post) {
      post.comments += 1;
      renderCommunityPosts();
    }
  }
}

function sharePost(postId) {
  alert("Link to post copied! Share with Smono community.");
}

function openCreatePostModal() {
  if (state.currentScreenId !== 'community') {
    jumpToScreen('community');
  }
  document.getElementById('new-post-text').value = '';
  state.selectedNewPostTags = [];
  state.selectedNewPostImage = '';
  
  const tagBtns = document.querySelectorAll('.select-post-tag');
  tagBtns.forEach(b => b.classList.remove('selected'));
  
  const imgBtns = document.querySelectorAll('.image-select-btn');
  imgBtns.forEach(b => b.classList.remove('selected'));
  
  document.getElementById('new-post-image-type').value = '';
  
  // Clear custom uploads on new draft
  removeUploadedPostImage();

  const modal = document.getElementById('create-post-modal');
  if (modal) modal.classList.add('active');
}

function closeCreatePostModal() {
  const modal = document.getElementById('create-post-modal');
  if (modal) modal.classList.remove('active');
}

function toggleSelectPostTag(el) {
  const tag = el.getAttribute('data-tag');
  if (!state.selectedNewPostTags) {
    state.selectedNewPostTags = [];
  }
  if (state.selectedNewPostTags.includes(tag)) {
    state.selectedNewPostTags = state.selectedNewPostTags.filter(t => t !== tag);
    el.classList.remove('selected');
  } else {
    state.selectedNewPostTags.push(tag);
    el.classList.add('selected');
  }
}

state.uploadedPostImageBase64 = null;

function selectPostMockImage(el, imgType) {
  const allBtns = document.querySelectorAll('.image-select-btn');
  allBtns.forEach(b => b.classList.remove('selected'));
  
  if (state.selectedNewPostImage === imgType) {
    state.selectedNewPostImage = '';
    document.getElementById('new-post-image-type').value = '';
  } else {
    state.selectedNewPostImage = imgType;
    document.getElementById('new-post-image-type').value = imgType;
    el.classList.add('selected');
    
    // Clear custom uploaded image if preset is selected
    removeUploadedPostImage();
  }
}

// User Media upload helpers
function triggerPostImageUpload() {
  const fileInput = document.getElementById('new-post-image-file');
  if (fileInput) fileInput.click();
}

function handlePostImageUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // Save data URL to state
      state.uploadedPostImageBase64 = e.target.result;
      
      // Update preview UI
      const previewImg = document.getElementById('new-post-image-preview');
      const previewContainer = document.getElementById('new-post-image-preview-container');
      if (previewImg && previewContainer) {
        previewImg.src = e.target.result;
        previewContainer.style.display = 'block';
      }

      // Deselect presets
      const allBtns = document.querySelectorAll('.image-select-btn');
      allBtns.forEach(b => b.classList.remove('selected'));
      state.selectedNewPostImage = '';
      const hiddenInput = document.getElementById('new-post-image-type');
      if (hiddenInput) hiddenInput.value = '';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function removeUploadedPostImage() {
  state.uploadedPostImageBase64 = null;
  const previewContainer = document.getElementById('new-post-image-preview-container');
  const previewImg = document.getElementById('new-post-image-preview');
  const fileInput = document.getElementById('new-post-image-file');
  if (previewContainer) previewContainer.style.display = 'none';
  if (previewImg) previewImg.src = '';
  if (fileInput) fileInput.value = '';
}

function submitCommunityPost() {
  const textVal = document.getElementById('new-post-text').value.trim();
  if (textVal === "") {
    alert("Please write a message first!");
    return;
  }

  const imageMaps = {
    coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=80",
    workout: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80",
    nature: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&auto=format&fit=crop&q=80"
  };

  // Prioritize uploaded photo, fall back to selected mock preset
  let selectedImage = '';
  if (state.uploadedPostImageBase64) {
    selectedImage = state.uploadedPostImageBase64;
  } else if (state.selectedNewPostImage) {
    selectedImage = imageMaps[state.selectedNewPostImage];
  }

  const postTags = state.selectedNewPostTags && state.selectedNewPostTags.length > 0 
    ? state.selectedNewPostTags 
    : ["daily update"];

  const gradients = ["sky", "rose", "emerald", "violet", "amber"];
  const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];

  const initials = state.userName ? state.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : "ME";

  const newPost = {
    id: Date.now(),
    author: state.userName || "Guest Resetter",
    initials: initials,
    gradient: randomGrad,
    journey: state.yearsSmoked ? `Day 1 (${state.cigarettesPerDay}/day)` : "Day 1 of Smono reset",
    date: "Today",
    text: textVal,
    imageUrl: selectedImage,
    tags: postTags,
    likes: 0,
    liked: false,
    comments: 0,
    saved: false
  };

  state.communityPosts.unshift(newPost);
  closeCreatePostModal();
  renderCommunityPosts();
  alert("Post published successfully!");
}

state.communityNameChosen = false;
state.tempCommunityName = "";

function openCommunityWelcomeModal() {
  const keepLabelSpan = document.getElementById('username-preview-state');
  if (keepLabelSpan) keepLabelSpan.innerText = state.userName || "User";
  
  state.tempCommunityName = state.userName || "User";
  
  // Set default form controls
  const radioKeep = document.getElementById('radio-username-keep');
  const radioNew = document.getElementById('radio-username-new');
  if (radioKeep) radioKeep.checked = true;
  if (radioNew) radioNew.checked = false;
  
  const inputContainer = document.getElementById('new-username-input-container');
  if (inputContainer) inputContainer.style.display = 'none';
  
  const customInput = document.getElementById('new-username-input');
  if (customInput) customInput.value = '';
  
  const appearPreview = document.getElementById('community-appear-preview');
  if (appearPreview) appearPreview.innerText = state.tempCommunityName;

  const modal = document.getElementById('community-welcome-modal');
  if (modal) modal.classList.add('active');
}

function closeCommunityWelcomeModal() {
  const modal = document.getElementById('community-welcome-modal');
  if (modal) modal.classList.remove('active');
}

function selectUsernameOption(option) {
  const inputContainer = document.getElementById('new-username-input-container');
  const keepRadio = document.getElementById('radio-username-keep');
  const newRadio = document.getElementById('radio-username-new');
  
  if (option === 'keep') {
    if (keepRadio) keepRadio.checked = true;
    if (newRadio) newRadio.checked = false;
    if (inputContainer) inputContainer.style.display = 'none';
    state.tempCommunityName = state.userName || "User";
  } else {
    if (newRadio) newRadio.checked = true;
    if (keepRadio) keepRadio.checked = false;
    if (inputContainer) inputContainer.style.display = 'block';
    const customVal = document.getElementById('new-username-input').value.trim();
    state.tempCommunityName = customVal !== "" ? customVal : "Custom User";
  }
  
  const appearPreview = document.getElementById('community-appear-preview');
  if (appearPreview) appearPreview.innerText = state.tempCommunityName;
}

function updateAppearNamePreview() {
  const customVal = document.getElementById('new-username-input').value.trim();
  state.tempCommunityName = customVal !== "" ? customVal : "Custom User";
  const appearPreview = document.getElementById('community-appear-preview');
  if (appearPreview) appearPreview.innerText = state.tempCommunityName;
}

function saveCommunityUsername() {
  const isNew = document.getElementById('radio-username-new').checked;
  if (isNew) {
    const customVal = document.getElementById('new-username-input').value.trim();
    if (customVal === "") {
      alert("Please enter a username!");
      return;
    }
    state.userName = customVal;
  }
  
  state.communityNameChosen = true;
  closeCommunityWelcomeModal();
  
  // Reload profile name displays
  const nameEl = document.getElementById('profile-user-name');
  if (nameEl) nameEl.innerText = state.userName;
  
  // If we are currently aiming for community screen, route them there fully now!
  state.currentScreenId = "community";
  
  // Hide other screen overlays
  const screens = document.querySelectorAll('.screen-view');
  screens.forEach(s => s.classList.remove('active'));
  
  const commScreen = document.getElementById('screen-community');
  if (commScreen) {
    commScreen.classList.add('active');
    commScreen.scrollTop = 0;
  }

  // Load posts dynamically
  renderCommunityPosts();

  // Show FAB button
  const fab = document.getElementById('create-post-fab');
  if (fab) fab.style.display = 'flex';
  
  // Update control panel active jumper button highlights
  const jumperBtns = document.querySelectorAll('.jump-btn');
  jumperBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick').includes("'community'")) {
      btn.classList.add('active');
    }
  });

  alert(`Username saved! You will appear as "${state.userName}" in Smono Circle.`);
}

state.activeCommunityMainTab = "posts";
state.videoStories = [
  {
    id: 1,
    author: "Sarah Jenkins",
    initials: "SJ",
    gradient: "rose",
    journey: "Day 3 of the program",
    caption: "My first morning without cravings! Coffee tastes so much better without that heavy smoke.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-cup-of-coffee-in-the-morning-41584-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    author: "David Thorne",
    initials: "DT",
    gradient: "emerald",
    journey: "Smoke free for 90 days",
    caption: "Day 90 reflection: My lungs feel incredibly clean and my daily runs are 2 minutes faster!",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-running-in-slow-motion-in-a-forest-41712-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    author: "Marcus K.",
    initials: "MK",
    gradient: "sky",
    journey: "Day 19 of the program",
    caption: "Breathing exercise tutorial. Whenever I feel a tight chest, I practice this 4-7-8 breathing loop.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-on-a-beach-at-sunset-40292-large.mp4",
    thumbnail: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=300&auto=format&fit=crop&q=80"
  }
];

function switchCommunityMainTab(tabName) {
  state.activeCommunityMainTab = tabName;

  const btnPosts = document.getElementById('toggle-tab-posts');
  const btnVideo = document.getElementById('toggle-tab-video');
  const postsWrapper = document.getElementById('community-posts-view-wrapper');
  const videoWrapper = document.getElementById('community-video-view-wrapper');
  const fab = document.getElementById('create-post-fab');

  if (tabName === 'posts') {
    if (btnPosts) {
      btnPosts.style.color = 'var(--color-accent-sky)';
      btnPosts.style.borderBottom = '2px solid var(--color-accent-sky)';
    }
    if (btnVideo) {
      btnVideo.style.color = 'var(--color-text-secondary)';
      btnVideo.style.borderBottom = '2px solid transparent';
    }
    if (postsWrapper) postsWrapper.style.display = 'flex';
    if (videoWrapper) videoWrapper.style.display = 'none';
    if (fab) fab.style.display = 'flex';
    renderCommunityPosts();
  } else {
    if (btnVideo) {
      btnVideo.style.color = 'var(--color-accent-sky)';
      btnVideo.style.borderBottom = '2px solid var(--color-accent-sky)';
    }
    if (btnPosts) {
      btnPosts.style.color = 'var(--color-text-secondary)';
      btnPosts.style.borderBottom = '2px solid transparent';
    }
    if (postsWrapper) postsWrapper.style.display = 'none';
    if (videoWrapper) videoWrapper.style.display = 'flex';
    if (fab) fab.style.display = 'none';
    renderVideoStories();
  }
}

function renderVideoStories() {
  const container = document.getElementById('community-video-stories-container');
  if (!container) return;

  container.innerHTML = state.videoStories.map(story => `
    <div class="video-story-card" onclick="openVideoStoryPlayer(${story.id})" style="position:relative; border-radius:16px; overflow:hidden; aspect-ratio:9/16; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.1); border: 1px solid var(--color-border-card); background:#1e293b; height: 180px;">
      <!-- Thumbnail image -->
      <img src="${story.thumbnail}" style="width:100%; height:100%; object-fit:cover; opacity:0.85;" />
      
      <!-- Gradient overlay -->
      <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%);"></div>
      
      <!-- Play icon overlay -->
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.9); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.3); color:#1e293b;">
        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style="margin-left:2px;">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      <!-- Info text overlay -->
      <div style="position:absolute; bottom:8px; left:8px; right:8px; color:#fff; display:flex; flex-direction:column; gap:1px;">
        <span style="font-size:10.5px; font-weight:800; text-shadow:0 1px 2px rgba(0,0,0,0.8);">${story.author}</span>
        <span style="font-size:7.5px; color:rgba(255,255,255,0.85); font-weight:700; text-shadow:0 1px 2px rgba(0,0,0,0.8);">${story.journey}</span>
      </div>
    </div>
  `).join('');
}

function openVideoStoryPlayer(storyId) {
  const story = state.videoStories.find(s => s.id === storyId);
  if (!story) return;

  const modal = document.getElementById('video-story-player-modal');
  const video = document.getElementById('story-player-video');
  const avatar = document.getElementById('video-story-avatar');
  const author = document.getElementById('video-story-author');
  const journey = document.getElementById('video-story-journey');
  const caption = document.getElementById('video-story-caption');

  if (!modal || !video) return;

  // Set story data
  video.src = story.videoUrl;
  if (avatar) {
    avatar.className = `post-avatar avatar-${story.gradient}`;
    avatar.innerText = story.initials;
  }
  if (author) author.innerText = story.author;
  if (journey) journey.innerText = story.journey;
  if (caption) caption.innerText = story.caption;

  // Show player modal
  modal.style.display = 'block';

  // Animate progress bar during video playback
  const progressBar = document.getElementById('video-story-progress-bar');
  if (progressBar) {
    progressBar.style.width = '0%';
    video.ontimeupdate = () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${percent}%`;
      }
    };
  }

  video.play().catch(err => console.log("Video auto-play blocked: ", err));
}

function closeVideoStoryPlayer() {
  const modal = document.getElementById('video-story-player-modal');
  const video = document.getElementById('story-player-video');
  if (video) {
    video.pause();
    video.src = '';
  }
  if (modal) modal.style.display = 'none';
}

function triggerUserVideoStoryUpload() {
  const fileInput = document.getElementById('community-video-file-input');
  if (fileInput) fileInput.click();
}

function handleUserVideoStoryUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Create a local blob URL for video
    const videoBlobUrl = URL.createObjectURL(file);
    
    // Generate initials and random gradient
    const gradients = ["sky", "rose", "emerald", "violet", "amber"];
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];
    const initials = state.userName ? state.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : "ME";

    // Ask user for a caption
    const userCaption = prompt("Enter a brief caption for your Video Story:", "My reset update today!");
    const captionVal = userCaption && userCaption.trim() !== "" ? userCaption : "Sharing my reset journey video!";

    // Create a new video story card
    const newStory = {
      id: Date.now(),
      author: state.userName || "Guest Resetter",
      initials: initials,
      gradient: randomGrad,
      journey: state.yearsSmoked ? `Day 1 (${state.cigarettesPerDay}/day)` : "Day 1 of Smono reset",
      caption: captionVal,
      videoUrl: videoBlobUrl,
      thumbnail: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&auto=format&fit=crop&q=80"
    };

    // Prepend to stories
    state.videoStories.unshift(newStory);
    
    // Re-render
    renderVideoStories();
    alert("Video Story uploaded successfully! Tap on it in Smono Stories to play.");
  }
}

window.openStoryViewer = openStoryViewer;
window.navigateStory = navigateStory;
window.toggleStoryPollOption = toggleStoryPollOption;
window.closeStoryViewer = closeStoryViewer;
window.completeDay1Story = completeDay1Story;
window.openAwarenessLog = openAwarenessLog;
window.selectTriggerPill = selectTriggerPill;
window.closeAwarenessLog = closeAwarenessLog;
window.submitAwarenessLog = submitAwarenessLog;
window.handleReflectionCardClick = handleReflectionCardClick;
window.openReflectionModal = openReflectionModal;
window.closeReflectionModal = closeReflectionModal;
window.submitReflection = submitReflection;
window.renderCommunityPosts = renderCommunityPosts;
window.filterCommunityPosts = filterCommunityPosts;
window.toggleLikePost = toggleLikePost;
window.toggleSavePost = toggleSavePost;
window.commentPost = commentPost;
window.sharePost = sharePost;
window.openCreatePostModal = openCreatePostModal;
window.closeCreatePostModal = closeCreatePostModal;
window.toggleSelectPostTag = toggleSelectPostTag;
window.selectPostMockImage = selectPostMockImage;
window.triggerPostImageUpload = triggerPostImageUpload;
window.handlePostImageUpload = handlePostImageUpload;
window.removeUploadedPostImage = removeUploadedPostImage;
window.submitCommunityPost = submitCommunityPost;
window.openCommunityWelcomeModal = openCommunityWelcomeModal;
window.closeCommunityWelcomeModal = closeCommunityWelcomeModal;
window.selectUsernameOption = selectUsernameOption;
window.updateAppearNamePreview = updateAppearNamePreview;
window.saveCommunityUsername = saveCommunityUsername;
window.switchCommunityMainTab = switchCommunityMainTab;
window.renderVideoStories = renderVideoStories;
window.openVideoStoryPlayer = openVideoStoryPlayer;
window.closeVideoStoryPlayer = closeVideoStoryPlayer;
function updateTrackerRealtimeStats() {
  const cigarettesPerDay = state.cigarettesPerDay || 12;
  const selectedProgramDay = state.selectedProgramDay || 1;
  const todaySmoked = state.todaySmokedCount || 0;
  
  // Total expected cigarettes if they smoked at their normal daily baseline rate up to the current day
  const expectedCigs = (cigarettesPerDay * (selectedProgramDay - 1)) + cigarettesPerDay;
  
  // Total actual smoked (based on daily logging)
  let actualSmoked = 0;
  for (let d = 1; d <= selectedProgramDay; d++) {
    if (d === selectedProgramDay) {
      actualSmoked += todaySmoked;
    } else {
      actualSmoked += (state.dailySmokedLogs && state.dailySmokedLogs[d] !== undefined) ? state.dailySmokedLogs[d] : 0;
    }
  }

  // Calculate Avoided Count
  const avoidedCigs = Math.max(0, expectedCigs - actualSmoked);

  // Calculate Saved Money
  const costPerCig = (state.packCost || 9.00) / 20;
  const savedMoney = avoidedCigs * costPerCig;

  // Calculate Time Saved (6 minutes active smoking time saved per avoided cigarette)
  const activeMinutesSaved = avoidedCigs * 6;
  let timeSavedStr = "";
  if (activeMinutesSaved < 60) {
    timeSavedStr = `${activeMinutesSaved}m`;
  } else {
    const hrs = Math.floor(activeMinutesSaved / 60);
    const mins = activeMinutesSaved % 60;
    timeSavedStr = mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }

  // Update DOM elements on the Tracker screen
  const elAvoided = document.getElementById('tracker-cigs-avoided');
  const elSavedMoney = document.getElementById('tracker-money-saved');
  const elTimeSaved = document.getElementById('tracker-time-saved');

  if (elAvoided) elAvoided.innerText = avoidedCigs;
  if (elSavedMoney) elSavedMoney.innerText = `${state.currencySymbol || '$'}${savedMoney.toFixed(2)}`;
  if (elTimeSaved) elTimeSaved.innerText = timeSavedStr;

  // Update main dashboard Hero Card elements to stay in sync
  const heroSavedMoney = document.getElementById('dash-saved-money');
  if (heroSavedMoney) {
    heroSavedMoney.innerText = `${state.currencySymbol || '$'}${savedMoney.toFixed(2)}`;
    const subtextEl = heroSavedMoney.nextElementSibling;
    if (subtextEl && subtextEl.classList.contains('hero-subtext')) {
      subtextEl.innerText = `${avoidedCigs} cigs avoided`;
    }
  }
}

state.day1Completed = false;
state.day2UnlockTime = 0;
state.congratsInterval = null;

function showDay1CongratsModal() {
  const oldModal = document.getElementById('congrats-modal');
  if (oldModal) oldModal.remove();

  const modal = document.createElement('div');
  modal.id = 'congrats-modal';
  modal.className = 'bottom-sheet-modal active';
  modal.innerHTML = `
    <div class="bottom-sheet-backdrop" onclick="closeCongratsModal()"></div>
    <div class="bottom-sheet-content glass-card" style="height: auto; max-height: 480px; display:flex; flex-direction:column; padding-bottom: 25px; text-align:center; padding-top: 30px; z-index: 10020;">
      <div class="bottom-sheet-drag-handle"></div>
      
      <div style="font-size: 50px; margin-bottom: 15px;">🎉</div>
      <h3 class="bottom-sheet-title" style="margin-bottom: 5px;">Congratulations, ${state.userName}!</h3>
      <h4 style="font-size: 16px; font-weight: 800; color: var(--color-primary-green); margin-bottom: 12px;">Day 1 Complete</h4>
      
      <p style="font-size: 13px; font-weight: 600; line-height: 1.5; color: var(--color-text-secondary); margin-bottom: 20px; padding: 0 10px;">
        You've completed your very first day of Smono. You pause-analyzed your cravings and mapped your psychological denial locks. This is a massive step towards visual clarity.
      </p>

      <!-- Ticking 12 Hour Unlock Timer Card -->
      <div style="background: rgba(59,130,246,0.06); border: 1px solid var(--color-border-card); border-radius: 16px; padding: 15px; margin-bottom: 20px;">
        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--color-text-secondary); letter-spacing: 0.5px; display:block; margin-bottom: 4px;">Day 2 Content Unlocks In</span>
        <div id="congrats-countdown-timer" style="font-size: 28px; font-weight: 800; color: var(--color-text-primary); font-family: monospace; letter-spacing: 1px;">12:00:00</div>
      </div>

      <button class="btn btn-primary w-full" onclick="closeCongratsModal()">Got it, Smono!</button>
    </div>
  `;

  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);

  startCongratsCountdown();
}

function closeCongratsModal() {
  const modal = document.getElementById('congrats-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
  // Keep countdown ticking in background for calendar overlay, but clear congrats window interval
}

function startCongratsCountdown() {
  if (state.congratsInterval) {
    clearInterval(state.congratsInterval);
  }

  const tick = () => {
    const timerEl = document.getElementById('congrats-countdown-timer');
    const overlayTimerEl = document.getElementById('home-day2-overlay-timer');
    const remainingMs = state.day2UnlockTime - Date.now();
    
    if (remainingMs <= 0) {
      if (timerEl) timerEl.innerText = "00:00:00";
      if (overlayTimerEl) overlayTimerEl.innerText = "00:00:00";
      updateJourneyDay2Countdown("Unlocked!");
      
      if (state.selectedProgramDay === 2) {
        renderDailyModules(2);
      }
      
      clearInterval(state.congratsInterval);
      return;
    }

    const totalSecs = Math.floor(remainingMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const hrsStr = hrs < 10 ? '0' + hrs : hrs;
    const minsStr = mins < 10 ? '0' + mins : mins;
    const secsStr = secs < 10 ? '0' + secs : secs;

    const formattedTime = `${hrsStr}:${minsStr}:${secsStr}`;

    if (timerEl) timerEl.innerText = formattedTime;
    if (overlayTimerEl) overlayTimerEl.innerText = formattedTime;
    updateJourneyDay2Countdown(formattedTime);
  };

  tick();
  state.congratsInterval = setInterval(tick, 1000);
}

function updateJourneyDay2Countdown(timerStr) {
  // Timeline calendar badge updates disabled to keep selector clean.
}

state.objectionSurveyAnswers = [];

function toggleSurveySelection(el) {
  const checkbox = el.querySelector('input[type="checkbox"]');
  setTimeout(() => {
    if (checkbox && checkbox.checked) {
      el.style.borderColor = "var(--color-accent-sky)";
      el.style.backgroundColor = "rgba(59, 130, 246, 0.04)";
    } else {
      el.style.borderColor = "var(--color-border-card)";
      el.style.backgroundColor = "var(--color-bg-card)";
    }
  }, 30);
}

state.objectionQueue = [];
state.currentObjectionIndex = 0;

function submitObjectionSurvey() {
  const selected = [];
  const selectedScreens = [];
  
  // Map checkboxes text to their objection screen ids
  const mappings = {
    "I’m not sure an app can help me quit.": "objection-app-help",
    "I don’t want to pay for an app.": "objection-not-pay",
    "I am afraid of cravings": "objection-cravings",
    "I want to subscribe, but the program feels expensive.": "objection-expensive",
    "I’m too busy right now. I might do it later.": "objection-later",
    "I’m thinking of quitting on my own.": "objection-own",
    "I only want to use the tracker for now.": "objection-cost",
    "I want to try the program first before subscribing.": "objection-cost"
  };

  const options = document.querySelectorAll('#screen-objection-survey .survey-option-label');
  options.forEach(opt => {
    const checkbox = opt.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      const text = opt.innerText.trim();
      selected.push(text);
      
      const targetScreen = mappings[text];
      if (targetScreen && !selectedScreens.includes(targetScreen)) {
        selectedScreens.push(targetScreen);
      }
    }
  });

  if (selected.length === 0) {
    alert("Please select at least one reason to help us improve!");
    return;
  }

  state.objectionSurveyAnswers = selected;
  state.objectionQueue = selectedScreens;
  state.currentObjectionIndex = 0;

  proceedToNextObjection();
}

function proceedToNextObjection() {
  if (state.currentObjectionIndex < state.objectionQueue.length) {
    const nextScreen = state.objectionQueue[state.currentObjectionIndex];
    state.currentObjectionIndex++;
    jumpToScreen(nextScreen);
  } else {
    // Queue completed! Take them to the free dashboard tracker
    alert("Thank you for sharing your feedback. We've loaded the free Smono tracker for you.");
    setProgramAccess(false);
    jumpToScreen('home');
  }
}

window.triggerUserVideoStoryUpload = triggerUserVideoStoryUpload;
window.handleUserVideoStoryUpload = handleUserVideoStoryUpload;
window.updateTrackerRealtimeStats = updateTrackerRealtimeStats;
window.showDay1CongratsModal = showDay1CongratsModal;
window.closeCongratsModal = closeCongratsModal;
window.startCongratsCountdown = startCongratsCountdown;
window.updateJourneyDay2Countdown = updateJourneyDay2Countdown;
window.toggleSurveySelection = toggleSurveySelection;
window.submitObjectionSurvey = submitObjectionSurvey;
window.proceedToNextObjection = proceedToNextObjection;

// --- Initialization ---
window.onload = () => {
  // Sync calendar math
  recalculateDynamicValues();
  
  // Set initial timeline day
  handleLockedCardClick(1);
  
  if (state.day1Completed && state.day2UnlockTime && state.day2UnlockTime - Date.now() > 0) {
    startCongratsCountdown();
  }
  
  // Start system clock
  updateIosTime();
  setInterval(updateIosTime, 1000);
  
  // Set default theme check
  setAppTheme('light');
  
  // Sync variables fields
  document.getElementById('calc-name').value = state.userName;
  document.getElementById('calc-qty').value = state.cigarettesPerDay;
  document.getElementById('calc-cost').value = state.packCost;
  document.getElementById('calc-years').value = state.yearsSmoked;
};

function triggerHomeTypewriter() {
  const el = document.getElementById('home-journey-title-header');
  if (!el) return;
  
  const text = "Your New Journey Towards Freedom Begins";
  el.textContent = "";
  let i = 0;
  
  if (window.homeTypewriterTimer) {
    clearInterval(window.homeTypewriterTimer);
  }
  window.homeTypewriterTimer = setInterval(() => {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(window.homeTypewriterTimer);
    }
  }, 30);
}

const dailyProgramData = {
  1: {
    tasksCount: "3 tasks",
    modules: [
      {
        type: "Lesson",
        duration: "5 mins",
        title: "Seeing the Trap",
        desc: "Instagram story reset guide: psychoeducation of the trap.",
        action: "openStoryViewer()",
        checkboxId: "check-lesson"
      },
      {
        type: "Exercise",
        duration: "4 mins",
        title: "The Awareness Log",
        desc: "Obsessional tracking: Time, Trigger, and choice logs.",
        action: "openAwarenessLog()",
        checkboxId: "check-exercise"
      },
      {
        type: "Reflection",
        duration: "3 mins",
        title: "Evening Reflection",
        desc: "Lock statement analysis & your first smoking history check.",
        action: "handleReflectionCardClick()",
        checkboxId: "check-reflection",
        isLocked: true
      }
    ]
  },
  2: {
    tasksCount: "3 tasks",
    modules: [
      {
        type: "Lesson",
        duration: "6 mins",
        title: "The Nicotine Bubble",
        desc: "Unmasking the chemical illusion and withdrawal curve.",
        action: "openStoryViewer()",
        checkboxId: "check-lesson-2"
      },
      {
        type: "Exercise",
        duration: "5 mins",
        title: "Trigger Mapping",
        desc: "Categorize your daily cravings into environmental cues.",
        action: "openAwarenessLog()",
        checkboxId: "check-exercise-2"
      },
      {
        type: "Reflection",
        duration: "3 mins",
        title: "Belief Disruption Log",
        desc: "Examine the thought: 'Cigarettes relieve my stress.'",
        action: "handleReflectionCardClick()",
        checkboxId: "check-reflection-2",
        isLocked: true
      }
    ]
  },
  3: {
    tasksCount: "3 tasks",
    modules: [
      {
        type: "Lesson",
        duration: "5 mins",
        title: "Social Conditioning",
        desc: "Why friends, drinks, and coffee feel incomplete without smoke.",
        action: "openStoryViewer()",
        checkboxId: "check-lesson-3"
      },
      {
        type: "Exercise",
        duration: "6 mins",
        title: "The Delay Protocol",
        desc: "Practice waiting out physical cravings with tactile pauses.",
        action: "openAwarenessLog()",
        checkboxId: "check-exercise-3"
      },
      {
        type: "Reflection",
        duration: "4 mins",
        title: "Daily Freedom Anchor",
        desc: "Define your core quitting anchor and long-term values.",
        action: "handleReflectionCardClick()",
        checkboxId: "check-reflection-3",
        isLocked: true
      }
    ]
  },
  4: {
    tasksCount: "3 tasks",
    modules: [
      {
        type: "Lesson",
        duration: "6 mins",
        title: "Stress & Willpower Trap",
        desc: "Why fighting cravings with willpower backfires every time.",
        action: "openStoryViewer()",
        checkboxId: "check-lesson-4"
      },
      {
        type: "Exercise",
        duration: "4 mins",
        title: "Breath Shift Exercise",
        desc: "A somatic replacement loop for deep stress relaxation.",
        action: "openAwarenessLog()",
        checkboxId: "check-exercise-4"
      },
      {
        type: "Reflection",
        duration: "3 mins",
        title: "Evening Cravings Scan",
        desc: "Audit the cues that triggered you today and how you handled them.",
        action: "handleReflectionCardClick()",
        checkboxId: "check-reflection-4",
        isLocked: true
      }
    ]
  },
  5: {
    tasksCount: "3 tasks",
    modules: [
      {
        type: "Lesson",
        duration: "7 mins",
        title: "The Final Cigarette Mindset",
        desc: "Preparing your mindset for the complete break from nicotine.",
        action: "openStoryViewer()",
        checkboxId: "check-lesson-5"
      },
      {
        type: "Exercise",
        duration: "5 mins",
        title: "Reclaiming Rituals",
        desc: "Replace your morning smoke with a new rewarding action.",
        action: "openAwarenessLog()",
        checkboxId: "check-exercise-5"
      },
      {
        type: "Reflection",
        duration: "4 mins",
        title: "Day 5 Commitment Audit",
        desc: "Review your milestones, chemical recovery, and baseline confidence.",
        action: "handleReflectionCardClick()",
        checkboxId: "check-reflection-5",
        isLocked: true
      }
    ]
  }
};

function renderDailyModules(dayNum) {
  const stack = document.querySelector('.daily-modules-stack');
  if (!stack) return;
  
  const data = dailyProgramData[dayNum] || dailyProgramData[1];
  
  let html = `
    <div class="stack-header">
      <h3>Day ${dayNum} Modules</h3>
      <span>${data.tasksCount}</span>
    </div>
  `;
  
  // Check if Day is countdown-locked (previous day completed, not premium, unlocked days max limit < dayNum, unlock time in future)
  const isDayTimerLocked = state.unlockTimers && state.unlockTimers[dayNum] && (state.unlockTimers[dayNum] - Date.now() > 0) && dayNum > state.maxUnlockedDay;
  
  if (isDayTimerLocked) {
    const remainingMs = state.unlockTimers[dayNum] - Date.now();
    const formattedTime = formatMsToTime(remainingMs);

    html += `
      <div style="width: 100%; border-radius: 16px; margin-top: 15px; display: flex; justify-content: center; align-items: center; min-height: 220px; box-sizing: border-box;">
        <div class="glass-card" style="padding: 24px 20px; border-radius: 16px; border: 1.5px solid var(--color-border-card); background: var(--color-bg-card); box-shadow: 0 10px 25px -10px rgba(0,0,0,0.12); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; width: 100%; max-width: 320px; text-align: center;">
          <span style="font-size: 26px;">🕒</span>
          <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--color-text-secondary); letter-spacing: 0.5px;">Day ${dayNum} Unlocks In</span>
          <div id="home-day-overlay-timer" style="font-size: 28px; font-weight: 900; color: var(--color-accent-sky); font-family: monospace; letter-spacing: 1px; line-height: 1; margin: 4px 0;">
            ${formattedTime}
          </div>
          <p style="font-size: 11px; font-weight: 600; color: var(--color-text-secondary); margin: 0; line-height: 1.45;">
            Take a break, rest, and reflect. Your mind is adapting.
          </p>
          <div style="margin-top: 8px; font-size: 10px; font-weight: 700; color: var(--color-text-muted); background: rgba(15,23,42,0.04); padding: 4px 10px; border-radius: 8px; display: inline-block;">
            WHO recommendation: 12h pause between modules
          </div>
        </div>
      </div>
    `;
    
    stack.innerHTML = html;
    return;
  }
  
  data.modules.forEach(m => {
    const isActuallyLocked = m.isLocked && !state.hasPaid;
    const lockClass = isActuallyLocked ? ' locked-card-preview' : '';
    
    // Check if task is completed
    const isCompleted = (state.completedTasks && state.completedTasks[m.checkboxId]) ||
                        (state.day1LessonCompleted && m.checkboxId === 'check-lesson') ||
                        (state.day1ExerciseCompleted && m.checkboxId === 'check-exercise') ||
                        (state.day1ReflectionCompleted && m.checkboxId === 'check-reflection') ||
                        (state.completedReflections && state.completedReflections[dayNum] && m.type === 'Reflection');

    // Create micro image icon container
    let microImageSvg = '';
    let thumbnailBg = '';
    
    if (m.type === 'Lesson') {
      thumbnailBg = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
      microImageSvg = `
        <svg width="20" height="20" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      `;
    } else if (m.type === 'Exercise') {
      thumbnailBg = 'linear-gradient(135deg, #10b981 0%, #047857 100%)';
      microImageSvg = `
        <svg width="20" height="20" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      `;
    } else { // Reflection
      thumbnailBg = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
      microImageSvg = `
        <svg width="20" height="20" fill="none" stroke="white" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 113.536 0V21h-7v-3.464z" />
        </svg>
      `;
    }

    // Bottom-right status tick positioning HTML
    let completedTickHtml = '';
    if (isActuallyLocked) {
      completedTickHtml = `
        <div style="position: absolute; bottom: 12px; right: 12px; width: 18px; height: 18px; border-radius: 50%; background: rgba(15,23,42,0.06); color: var(--color-text-secondary); display: flex; align-items: center; justify-content: center; font-size: 8px;">
          <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm-3 5c0-1.66 1.34-3 3-3s3 1.34 3 3v3H9V7zm3 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
        </div>
      `;
    } else if (isCompleted) {
      completedTickHtml = `
        <div style="position: absolute; bottom: 12px; right: 12px; width: 18px; height: 18px; border-radius: 50%; background: var(--color-primary-green); color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; box-shadow: var(--shadow-sm);">✓</div>
      `;
    } else {
      completedTickHtml = `
        <div style="position: absolute; bottom: 12px; right: 12px; width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--color-border-card); background: transparent;"></div>
      `;
    }

    html += `
      <div class="module-task-card glass-card${lockClass}" onclick="${isActuallyLocked ? 'handleReflectionCardClick()' : m.action}" style="position: relative; display: flex; gap: 14px; padding: 14px; align-items: flex-start; min-height: 80px;">
        <div style="width: 42px; height: 42px; border-radius: 10px; background: ${thumbnailBg}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.15); box-shadow: var(--shadow-sm);">
          ${microImageSvg}
        </div>
        <div class="mod-info" style="flex-grow: 1; padding-right: 18px;">
          <span class="mod-tag">${m.type} • ${m.duration}</span>
          <h4 style="margin: 3px 0; font-size: 13.5px; font-weight: 800; color: var(--color-text-primary);">${m.title}</h4>
          <p style="margin: 0; font-size: 11px; line-height: 1.45; color: var(--color-text-secondary);">${m.desc}</p>
        </div>
        ${completedTickHtml}
        ${isActuallyLocked ? '<div class="premium-shimmer-effect"></div>' : ''}
      </div>
    `;
  });
  
  stack.innerHTML = html;
}

function setUnlockedDayLimit(dayNum) {
  state.maxUnlockedDay = dayNum;
  
  // Set all previous reflections as completed for clean testing
  state.completedReflections = state.completedReflections || {};
  for (let d = 1; d < dayNum; d++) {
    state.completedReflections[d] = true;
    if (state.unlockTimers) {
      state.unlockTimers[d + 1] = null; // Clear unlock timers for unlocked days
    }
  }

  // Refresh active program buttons in jumper
  const levelBtns = document.querySelectorAll('.program-level-btn');
  levelBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick').includes(`setUnlockedDayLimit(${dayNum})`)) {
      btn.classList.add('active');
    }
  });

  // Refresh lock indicators on timeline selector cards
  refreshTimelineLockStyles();

  // Re-render currently selected modules stack
  renderDailyModules(state.selectedProgramDay || 1);
}

function refreshTimelineLockStyles() {
  for (let d = 2; d <= 5; d++) {
    const card = document.getElementById(`day-${d}-card`);
    if (card) {
      const isAccessible = d <= state.maxUnlockedDay || 
                           (d === state.maxUnlockedDay + 1 && state.completedReflections[state.maxUnlockedDay]);
      
      if (isAccessible || state.hasPaid) {
        card.classList.remove('locked-card-preview');
        const lockIcon = card.querySelector('.day-status-icon');
        if (lockIcon) lockIcon.innerHTML = '';
      } else {
        card.classList.add('locked-card-preview');
        const lockIcon = card.querySelector('.day-status-icon');
        if (lockIcon) {
          lockIcon.innerHTML = '<svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm-3 5c0-1.66 1.34-3 3-3s3 1.34 3 3v3H9V7zm3 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>';
        }
      }
    }
  }
}

window.setUnlockedDayLimit = setUnlockedDayLimit;
window.refreshTimelineLockStyles = refreshTimelineLockStyles;

function openQuickAddPanel() {
  const oldPanel = document.getElementById('quick-add-panel');
  if (oldPanel) oldPanel.remove();

  const modal = document.createElement('div');
  modal.id = 'quick-add-panel';
  modal.className = 'bottom-sheet-modal active';
  modal.innerHTML = `
    <div class="bottom-sheet-backdrop" onclick="closeQuickAddPanel()"></div>
    <div class="bottom-sheet-content glass-card" style="height: auto; max-height: 520px; display:flex; flex-direction:column; padding-bottom: 25px; border-top-left-radius: 24px; border-top-right-radius: 24px; background: var(--color-bg-card);">
      <div class="bottom-sheet-drag-handle"></div>
      
      <h3 class="bottom-sheet-title" style="margin-bottom: 8px; font-size: 18px; font-weight: 800; text-align: center; color: var(--color-text-primary);">Quick Add Entry</h3>
      <p style="font-size: 11.5px; font-weight: 600; color: var(--color-text-secondary); text-align: center; margin: 0; margin-bottom: 20px;">
        Register details to update your statistics and trackers.
      </p>

      <div style="display: flex; flex-direction: column; gap: 10px; padding: 0 5px;">
        
        <!-- Option 1: I have smoked -->
        <button class="glass-card" onclick="handleQuickAddSmoked()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; border: 1.5px solid var(--color-border-card); background: rgba(239, 68, 68, 0.04); text-align: left; cursor: pointer; transition: all 0.2s; width: 100%;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">🚬</span>
            <div>
              <h4 style="margin: 0; font-size: 13.5px; font-weight: 800; color: var(--color-text-primary);">I have smoked</h4>
              <p style="margin: 0; font-size: 10.5px; color: var(--color-text-muted);">Add 1 cigarette to today's count</p>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--color-text-secondary);">&rarr;</span>
        </button>

        <!-- Option 2: I have a craving -->
        <button class="glass-card" onclick="handleQuickAddCraving()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; border: 1.5px solid var(--color-border-card); background: rgba(245, 158, 11, 0.04); text-align: left; cursor: pointer; transition: all 0.2s; width: 100%;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">⚡</span>
            <div>
              <h4 style="margin: 0; font-size: 13.5px; font-weight: 800; color: var(--color-text-primary);">I have a craving</h4>
              <p style="margin: 0; font-size: 10.5px; color: var(--color-text-muted);">Log cravings stats and trigger logs</p>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--color-text-secondary);">&rarr;</span>
        </button>

        <!-- Option 3: Track your mood -->
        <button class="glass-card" onclick="handleQuickAddMood()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; border: 1.5px solid var(--color-border-card); background: rgba(16, 185, 129, 0.04); text-align: left; cursor: pointer; transition: all 0.2s; width: 100%;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">🧘</span>
            <div>
              <h4 style="margin: 0; font-size: 13.5px; font-weight: 800; color: var(--color-text-primary);">Track your mood</h4>
              <p style="margin: 0; font-size: 10.5px; color: var(--color-text-muted);">Record how you are feeling right now</p>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--color-text-secondary);">&rarr;</span>
        </button>

        <!-- Option 4: Add a savings goal -->
        <button class="glass-card" onclick="handleQuickAddSavings()" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 14px; border: 1.5px solid var(--color-border-card); background: rgba(59, 130, 246, 0.04); text-align: left; cursor: pointer; transition: all 0.2s; width: 100%;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">💰</span>
            <div>
              <h4 style="margin: 0; font-size: 13.5px; font-weight: 800; color: var(--color-text-primary);">Add a savings goal</h4>
              <p style="margin: 0; font-size: 10.5px; color: var(--color-text-muted);">Set target amounts for what you save</p>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--color-text-secondary);">&rarr;</span>
        </button>

      </div>
      
      <button class="btn btn-secondary w-full" onclick="closeQuickAddPanel()" style="margin-top: 18px;">Cancel</button>
    </div>
  `;

  const phoneDisplay = document.getElementById('phone-display') || document.body;
  phoneDisplay.appendChild(modal);
}

function closeQuickAddPanel() {
  const modal = document.getElementById('quick-add-panel');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 300);
  }
}

function handleQuickAddSmoked() {
  incrementTodaySmoked();
  closeQuickAddPanel();
  if (state.currentScreenId === 'tracker') {
    renderTrackerInsights();
  }
  alert("Cigarette logged successfully! Smono updated your progress counts and dashboard statistics.");
}

function handleQuickAddCraving() {
  const content = document.querySelector('#quick-add-panel .bottom-sheet-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="bottom-sheet-drag-handle"></div>
    <h3 class="bottom-sheet-title" style="margin-bottom: 8px; font-size: 18px; font-weight: 800; text-align: center; color: var(--color-text-primary);">Log Cravings Trigger</h3>
    
    <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 10px; text-align: left;">
      <div>
        <label style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--color-text-secondary); display: block; margin-bottom: 6px;">Select Trigger</label>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;" id="craving-triggers-container">
          ${['Stress', 'Boredom', 'After Meal', 'Driving', 'Socializing', 'Morning Routine'].map(t => `
            <span class="trigger-pill" onclick="selectQuickAddTrigger(this)" style="background:var(--color-bg-card); border:1px solid var(--color-border-card); border-radius:20px; padding:6px 12px; font-size:11px; font-weight:700; color:var(--color-text-secondary); cursor:pointer; transition:all 0.2s;">${t}</span>
          `).join('')}
        </div>
      </div>
      
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
          <label style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--color-text-secondary);">Craving Intensity</label>
          <span id="quick-craving-intensity-val" style="font-size:12px; font-weight:800; color:var(--color-accent-sky);">5/10</span>
        </div>
        <input type="range" min="1" max="10" value="5" oninput="document.getElementById('quick-craving-intensity-val').innerText = this.value + '/10'" style="width: 100%; accent-color: var(--color-accent-sky);" />
      </div>
      
      <button class="btn btn-primary w-full" onclick="saveQuickAddCraving()" style="margin-top: 10px;">Save Craving Log</button>
      <button class="btn btn-secondary w-full" onclick="openQuickAddPanel()">Back</button>
    </div>
  `;
}

function selectQuickAddTrigger(el) {
  const pills = document.querySelectorAll('#craving-triggers-container .trigger-pill');
  pills.forEach(p => {
    p.style.background = 'var(--color-bg-card)';
    p.style.borderColor = 'var(--color-border-card)';
    p.style.color = 'var(--color-text-secondary)';
    p.classList.remove('selected');
  });
  el.style.background = 'var(--color-accent-sky)';
  el.style.borderColor = 'var(--color-accent-sky)';
  el.style.color = '#fff';
  el.classList.add('selected');
}

function saveQuickAddCraving() {
  const activeTrigger = document.querySelector('#craving-triggers-container .trigger-pill.selected');
  const triggerVal = activeTrigger ? activeTrigger.innerText : 'Unknown Trigger';
  
  state.cravingLogs = state.cravingLogs || [];
  state.cravingLogs.push({
    timestamp: Date.now(),
    trigger: triggerVal,
    intensity: document.getElementById('quick-craving-intensity-val') ? document.getElementById('quick-craving-intensity-val').innerText : '5/10'
  });
  
  closeQuickAddPanel();
  if (state.currentScreenId === 'tracker') {
    renderTrackerInsights();
  }
  alert(`Craving registered! Trigger logged as: ${triggerVal}. Pause and deep breathe!`);
}

function handleQuickAddMood() {
  const content = document.querySelector('#quick-add-panel .bottom-sheet-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="bottom-sheet-drag-handle"></div>
    <h3 class="bottom-sheet-title" style="margin-bottom: 8px; font-size: 18px; font-weight: 800; text-align: center; color: var(--color-text-primary);">Track Your Mood</h3>
    
    <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 10px; text-align:center;">
      <p style="font-size: 11.5px; font-weight:600; color:var(--color-text-secondary);">How are you feeling right now?</p>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 10px 0;">
        ${[
          { emoji: '😊', label: 'Happy' },
          { emoji: '😔', label: 'Sad' },
          { emoji: '😰', label: 'Anxious' },
          { emoji: '😡', label: 'Irritated' },
          { emoji: '🥱', label: 'Bored' },
          { emoji: '⚡', label: 'Restless' },
          { emoji: '😴', label: 'Tired' },
          { emoji: '😇', label: 'Calm' }
        ].map(m => `
          <button onclick="selectQuickAddMood(this, '${m.label}')" class="glass-card mood-select-btn" style="display:flex; flex-direction:column; align-items:center; gap:6px; padding:12px 6px; border: 1.5px solid var(--color-border-card); background:transparent; border-radius:12px; cursor:pointer; transition:all 0.2s; outline:none;">
            <span style="font-size: 24px;">${m.emoji}</span>
            <span style="font-size: 9.5px; font-weight: 700; color:var(--color-text-secondary);">${m.label}</span>
          </button>
        `).join('')}
      </div>
      
      <button class="btn btn-primary w-full" onclick="saveQuickAddMood()" style="margin-top: 10px;">Save Mood Log</button>
      <button class="btn btn-secondary w-full" onclick="openQuickAddPanel()">Back</button>
    </div>
  `;
}

function selectQuickAddMood(btn, label) {
  const btns = document.querySelectorAll('.mood-select-btn');
  btns.forEach(b => {
    b.style.borderColor = 'var(--color-border-card)';
    b.style.background = 'transparent';
    b.classList.remove('selected');
  });
  btn.style.borderColor = 'var(--color-accent-sky)';
  btn.style.background = 'rgba(56, 189, 248, 0.08)';
  btn.classList.add('selected');
  state.selectedQuickMood = label;
}

function saveQuickAddMood() {
  const mood = state.selectedQuickMood || 'Calm';
  state.moodLogs = state.moodLogs || [];
  state.moodLogs.push({
    timestamp: Date.now(),
    mood: mood
  });
  
  closeQuickAddPanel();
  if (state.currentScreenId === 'tracker') {
    renderTrackerInsights();
  }
  alert(`Mood saved! You logged your current feeling as: ${mood}. Smono will reflect this in your analytics.`);
}

function handleQuickAddSavings() {
  const content = document.querySelector('#quick-add-panel .bottom-sheet-content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="bottom-sheet-drag-handle"></div>
    <h3 class="bottom-sheet-title" style="margin-bottom: 8px; font-size: 18px; font-weight: 800; text-align: center; color: var(--color-text-primary);">Add a Savings Goal</h3>
    
    <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 10px; text-align: left;">
      <div>
        <label style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--color-text-secondary); display: block; margin-bottom: 5px;">What are you saving for?</label>
        <input type="text" id="quick-savings-title" placeholder="e.g. Flight to Greece, New Gym Shoes" style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--color-border-card); background:var(--color-bg-card); color:var(--color-text-primary); font-size:13px; font-weight:600;" />
      </div>
      
      <div>
        <label style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--color-text-secondary); display: block; margin-bottom: 5px;">Target Amount ($)</label>
        <input type="number" id="quick-savings-amount" value="100" style="width:100%; padding:10px; border-radius:10px; border:1px solid var(--color-border-card); background:var(--color-bg-card); color:var(--color-text-primary); font-size:13px; font-weight:600;" />
      </div>
      
      <button class="btn btn-primary w-full" onclick="saveQuickAddSavings()" style="margin-top: 10px;">Save Goal</button>
      <button class="btn btn-secondary w-full" onclick="openQuickAddPanel()">Back</button>
    </div>
  `;
}

function saveQuickAddSavings() {
  const goalTitle = document.getElementById('quick-savings-title').value || 'Unlabeled Goal';
  const goalAmount = parseFloat(document.getElementById('quick-savings-amount').value) || 100.0;
  
  state.savingsGoals = state.savingsGoals || [];
  state.savingsGoals.push({
    title: goalTitle,
    target: goalAmount
  });
  
  const revealTitleEl = document.getElementById('cost-reveal-goal-title');
  const revealTargetEl = document.getElementById('cost-reveal-goal-target');
  if (revealTitleEl) revealTitleEl.innerText = goalTitle;
  if (revealTargetEl) revealTargetEl.innerText = `$${goalAmount.toFixed(2)}`;
  
  closeQuickAddPanel();
  if (state.currentScreenId === 'tracker') {
    renderTrackerInsights();
  }
  alert(`Savings goal saved! Smono updated your progress target to save towards: ${goalTitle}.`);
}

window.openQuickAddPanel = openQuickAddPanel;
window.closeQuickAddPanel = closeQuickAddPanel;
window.handleQuickAddSmoked = handleQuickAddSmoked;
window.handleQuickAddCraving = handleQuickAddCraving;
window.selectQuickAddTrigger = selectQuickAddTrigger;
window.saveQuickAddCraving = saveQuickAddCraving;
window.handleQuickAddMood = handleQuickAddMood;
window.selectQuickAddMood = selectQuickAddMood;
window.saveQuickAddMood = saveQuickAddMood;
window.handleQuickAddSavings = handleQuickAddSavings;
window.saveQuickAddSavings = saveQuickAddSavings;

function renderTrackerInsights() {
  const container = document.getElementById('tracker-insights-section');
  if (!container) return;

  // 1. Cigarettes Smoked history summary
  let todaySmoked = state.todaySmokedCount || 0;
  let totalSmokedTracked = 0;
  if (state.dailySmokedLogs) {
    Object.values(state.dailySmokedLogs).forEach(v => {
      totalSmokedTracked += parseInt(v) || 0;
    });
  }
  totalSmokedTracked = Math.max(totalSmokedTracked, todaySmoked);

  let smokedHtml = `
    <div class="glass-card" style="padding: 16px; border-radius: 18px; border: 1.5px solid var(--color-border-card); background: var(--color-bg-card); text-align: left;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <h4 style="margin:0; font-size:13px; font-weight:800; color:var(--color-text-primary); display:flex; align-items:center; gap:8px;">
          <span>🚬</span> Cigarettes Smoked Log
        </h4>
        <span style="font-size:10px; font-weight:800; background:rgba(239,68,68,0.08); color:#ef4444; padding:2px 8px; border-radius:10px;">Active</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; text-align:center;">
        <div style="background:rgba(15,23,42,0.03); padding:10px; border-radius:10px;">
          <span style="font-size:9px; font-weight:800; color:var(--color-text-secondary); text-transform:uppercase; letter-spacing:0.3px;">Today</span>
          <h3 style="margin:2px 0 0 0; font-size:20px; font-weight:900; color:var(--color-text-primary);">${todaySmoked}</h3>
        </div>
        <div style="background:rgba(15,23,42,0.03); padding:10px; border-radius:10px;">
          <span style="font-size:9px; font-weight:800; color:var(--color-text-secondary); text-transform:uppercase; letter-spacing:0.3px;">Total Tracked</span>
          <h3 style="margin:2px 0 0 0; font-size:20px; font-weight:900; color:var(--color-text-primary);">${totalSmokedTracked}</h3>
        </div>
      </div>
    </div>
  `;

  // 2. Cravings Trigger & Intensity Interpretation
  let cravingHtml = '';
  const cravings = state.cravingLogs || [];
  
  if (cravings.length === 0) {
    cravingHtml = `
      <div class="glass-card" style="padding: 16px; border-radius: 18px; border: 1.5px solid var(--color-border-card); background: var(--color-bg-card); text-align:center; padding: 25px 15px;">
        <span style="font-size:24px;">⚡</span>
        <h4 style="margin:8px 0 4px 0; font-size:13px; font-weight:800; color:var(--color-text-primary);">Triggers & Cravings Analysis</h4>
        <p style="margin:0; font-size:11px; color:var(--color-text-muted); line-height:1.4;">No cravings tracked yet. Use the <strong>+ Button</strong> at the top right to log a craving entry and generate your CBT insights!</p>
      </div>
    `;
  } else {
    const triggerCounts = {};
    let totalIntensity = 0;
    cravings.forEach(c => {
      triggerCounts[c.trigger] = (triggerCounts[c.trigger] || 0) + 1;
      const intensityNum = parseInt(c.intensity) || 5;
      totalIntensity += intensityNum;
    });

    let topTrigger = 'Unknown';
    let maxCount = 0;
    Object.keys(triggerCounts).forEach(t => {
      if (triggerCounts[t] > maxCount) {
        maxCount = triggerCounts[t];
        topTrigger = t;
      }
    });

    const avgIntensity = (totalIntensity / cravings.length).toFixed(1);

    let interpretationText = '';
    if (topTrigger === 'Stress') {
      interpretationText = 'Your cravings are heavily linked to stress. This shows you are using nicotine to regulate emotional states. Practice Smono\'s 5-second pause to create space for a healthy response.';
    } else if (topTrigger === 'Boredom') {
      interpretationText = 'You tend to vape/smoke when bored. This indicates nicotine is acting as a physical reward filler. Substitution therapy (chewing gum, brief walks) is highly effective for this trigger.';
    } else if (topTrigger === 'Socializing') {
      interpretationText = 'Your social environment is a strong trigger. Peer associations trigger automatic mimicry. Try telling friends you are pausing before you meet up.';
    } else if (topTrigger === 'After Meal' || topTrigger === 'Morning Routine') {
      interpretationText = 'This is a classical motor habit loop trigger. You have paired finishing a meal or waking up with smoking. Disrupt this loop by changing your immediate physical location right after these events.';
    } else {
      interpretationText = 'Your trigger profile indicates a mix of environmental cues. Pause for 5 seconds before lighting up to analyze the trigger, which weakens the classical conditioning link.';
    }

    cravingHtml = `
      <div class="glass-card" style="padding: 16px; border-radius: 18px; border: 1.5px solid var(--color-border-card); background: var(--color-bg-card); text-align: left;">
        <h4 style="margin:0 0 12px 0; font-size:13px; font-weight:800; color:var(--color-text-primary); display:flex; align-items:center; gap:8px;">
          <span>⚡</span> Triggers & Cravings Analysis
        </h4>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; text-align:center;">
          <div style="background:rgba(245,158,11,0.03); padding:10px; border-radius:10px; border:1px solid rgba(245,158,11,0.15);">
            <span style="font-size:9px; font-weight:800; color:var(--color-text-secondary); text-transform:uppercase; letter-spacing:0.3px;">Top Trigger</span>
            <h4 style="margin:2px 0 0 0; font-size:14px; font-weight:900; color:var(--color-accent-orange);">${topTrigger}</h4>
          </div>
          <div style="background:rgba(56,189,248,0.03); padding:10px; border-radius:10px; border:1px solid rgba(56,189,248,0.15);">
            <span style="font-size:9px; font-weight:800; color:var(--color-text-secondary); text-transform:uppercase; letter-spacing:0.3px;">Avg Intensity</span>
            <h4 style="margin:2px 0 0 0; font-size:14px; font-weight:900; color:var(--color-accent-sky);">${avgIntensity}/10</h4>
          </div>
        </div>

        <div style="background:rgba(59,130,246,0.05); padding:12px; border-radius:12px; border:1px solid var(--color-border-card);">
          <span style="font-size:9px; font-weight:800; color:var(--color-accent-sky); text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">CBT Interpretation</span>
          <p style="margin:0; font-size:11px; line-height:1.45; color:var(--color-text-primary); font-weight:600;">
            ${interpretationText}
          </p>
        </div>
      </div>
    `;
  }

  // 3. Mood tracking history
  let moodHtml = '';
  const moods = state.moodLogs || [];
  if (moods.length === 0) {
    moodHtml = `
      <div class="glass-card" style="padding: 16px; border-radius: 18px; border: 1.5px solid var(--color-border-card); background: var(--color-bg-card); text-align:center; padding: 25px 15px;">
        <span style="font-size:24px;">🧘</span>
        <h4 style="margin:8px 0 4px 0; font-size:13px; font-weight:800; color:var(--color-text-primary);">Mood Tracking History</h4>
        <p style="margin:0; font-size:11px; color:var(--color-text-muted); line-height:1.4;">No mood logs recorded yet. Tap the <strong>+ Button</strong> at the top right to record your first mood!</p>
      </div>
    `;
  } else {
    const recentMoods = moods.slice(-5).reverse();
    const moodEmojis = {
      'Happy': '😊',
      'Sad': '😔',
      'Anxious': '😰',
      'Irritated': '😡',
      'Bored': '🥱',
      'Restless': '⚡',
      'Tired': '😴',
      'Calm': '😇'
    };

    let listHtml = '';
    recentMoods.forEach(m => {
      const emoji = moodEmojis[m.mood] || '😊';
      const timeStr = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      listHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:rgba(15,23,42,0.03); border-radius:10px; margin-bottom:6px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">${emoji}</span>
            <span style="font-size:12px; font-weight:800; color:var(--color-text-primary);">${m.mood}</span>
          </div>
          <span style="font-size:10px; font-weight:700; color:var(--color-text-muted);">${timeStr}</span>
        </div>
      `;
    });

    moodHtml = `
      <div class="glass-card" style="padding: 16px; border-radius: 18px; border: 1.5px solid var(--color-border-card); background: var(--color-bg-card); text-align: left;">
        <h4 style="margin:0 0 12px 0; font-size:13px; font-weight:800; color:var(--color-text-primary); display:flex; align-items:center; gap:8px;">
          <span>🧘</span> Mood History (Recent)
        </h4>
        <div>
          ${listHtml}
        </div>
      </div>
    `;
  }

  // 4. Savings Goals
  let savingsHtml = '';
  const goals = state.savingsGoals || [];
  
  let totalSavedAmount = 0;
  const savedMoneyEl = document.getElementById('tracker-money-saved');
  if (savedMoneyEl) {
    totalSavedAmount = parseFloat(savedMoneyEl.innerText.replace('$', '')) || 0;
  }
  if (totalSavedAmount === 0) {
    totalSavedAmount = 9.00;
  }

  if (goals.length === 0) {
    savingsHtml = `
      <div class="glass-card" style="padding: 16px; border-radius: 18px; border: 1.5px solid var(--color-border-card); background: var(--color-bg-card); text-align:center; padding: 25px 15px;">
        <span style="font-size:24px;">💰</span>
        <h4 style="margin:8px 0 4px 0; font-size:13px; font-weight:800; color:var(--color-text-primary);">Savings Goals Progress</h4>
        <p style="margin:0; font-size:11px; color:var(--color-text-muted); line-height:1.4;">No savings goals defined yet. Use the <strong>+ Button</strong> at the top right to set your first target!</p>
      </div>
    `;
  } else {
    let goalsListHtml = '';
    goals.forEach(g => {
      const pct = Math.min(100, Math.round((totalSavedAmount / g.target) * 100));
      goalsListHtml += `
        <div style="margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-size:12px; font-weight:800; color:var(--color-text-primary);">${g.title}</span>
            <span style="font-size:11px; font-weight:800; color:var(--color-primary-green);">${pct}% ($${totalSavedAmount.toFixed(2)} / $${g.target.toFixed(0)})</span>
          </div>
          <div style="height:6px; background:rgba(15,23,42,0.06); border-radius:3px; overflow:hidden;">
            <div style="height:100%; width:${pct}%; background:linear-gradient(90deg, #10b981 0%, #059669 100%); border-radius:3px;"></div>
          </div>
        </div>
      `;
    });

    savingsHtml = `
      <div class="glass-card" style="padding: 16px; border-radius: 18px; border: 1.5px solid var(--color-border-card); background: var(--color-bg-card); text-align: left;">
        <h4 style="margin:0 0 12px 0; font-size:13px; font-weight:800; color:var(--color-text-primary); display:flex; align-items:center; gap:8px;">
          <span>💰</span> Savings Goals Progress
        </h4>
        <div>
          ${goalsListHtml}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <h3 style="font-size:11px; font-weight:900; color:var(--color-text-secondary); text-transform:uppercase; letter-spacing:0.5px; margin: 15px 0 5px 0; text-align: left;">Insights & Analytics</h3>
    ${smokedHtml}
    ${cravingHtml}
    ${moodHtml}
    ${savingsHtml}
  `;
}

window.renderTrackerInsights = renderTrackerInsights;

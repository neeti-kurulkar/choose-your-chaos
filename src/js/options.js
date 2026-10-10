// Shared option lists for the profile and "Tell us" forms.
// [value, label]. "prefer-not" always means "Prefer not to say".

export const AGE = [
  ['under-18', 'Under 18'], ['18-24', '18–24'], ['25-34', '25–34'], ['35-44', '35–44'],
  ['45-54', '45–54'], ['55-plus', '55+'], ['prefer-not', 'Prefer not to say'],
];
export const GENDER = [
  ['woman', 'Woman'], ['man', 'Man'], ['non-binary', 'Non-binary'],
  ['self-describe', 'Self-describe'], ['prefer-not', 'Prefer not to say'],
];
export const WORK = [
  ['student', 'Student'], ['full-time', 'Working full time'], ['part-time', 'Working part time'],
  ['freelance', 'Freelance / self-employed'], ['homemaker', 'Homemaker'], ['between-jobs', 'Between jobs'],
  ['retired', 'Retired'], ['prefer-not', 'Prefer not to say'],
];
export const MARITAL = [
  ['single', 'Single'], ['relationship', 'In a relationship'], ['married', 'Married'],
  ['separated', 'Separated / divorced'], ['widowed', 'Widowed'], ['prefer-not', 'Prefer not to say'],
];
export const CITY = [
  ['metro', 'Metro'], ['tier-2', 'Tier-2 city'], ['town', 'Town'], ['village', 'Village'],
  ['prefer-not', 'Prefer not to say'],
];
export const LANGUAGES = [
  ['en', 'English'], ['hi', 'Hindi'], ['bn', 'Bengali'], ['mr', 'Marathi'], ['te', 'Telugu'],
  ['ta', 'Tamil'], ['gu', 'Gujarati'], ['ur', 'Urdu'], ['kn', 'Kannada'], ['or', 'Odia'],
  ['ml', 'Malayalam'], ['pa', 'Punjabi'], ['as', 'Assamese'], ['other', 'Another language'],
  ['prefer-not', 'Prefer not to say'],
];
export const TRANSIT = [
  ['daily', 'Daily'], ['sometimes', 'Sometimes'], ['rarely', 'Rarely'], ['never', 'Never'],
  ['prefer-not', 'Prefer not to say'],
];
export const SUB_TYPE = [
  ['share', 'Share an experience'], ['suggest', 'Suggest a scenario for the game'], ['both', 'Both'],
];
export const SETTING = [
  ['cab', 'Cab / auto / ride'], ['public-transport', 'Public transport'], ['workplace', 'Workplace'],
  ['campus', 'College / campus'], ['street', 'Market / street'], ['home', 'Home / neighbourhood / PG'],
  ['family-function', 'Family function'], ['online', 'Online / social media'], ['other', 'Other'],
];
export const TONE = [['funny', 'Funny and sarcastic'], ['serious', 'Calm and serious'], ['not-sure', 'Not sure']];

export const labelOf = (list, v) => (list.find(([k]) => k === v) || [, ''])[1];

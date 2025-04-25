// theme.js

// Colors
export const colors = {
  primary: {
    main: '#EF4136',
    100: '#EE3A2D',
    200: '#ED2F21',
    300: '#EC2415',
    400: '#E22012',
    500: '#D61E11',
    600: '#CA1D10',
    700: '#BE1B0F',
    800: '#A7180E',
    900: '#9B160D',
    contrastText: '#000',
  },
  secondary: {
    main: '#7F56D9',
    100: '#F4EBFF',
    200: '#E9D7FE',
    300: '#D6BBFB',
    400: '#B692F6',
    500: '#9E77ED',
    600: '#7F56D9',
    700: '#6941C6',
    800: '#53389E',
    900: '#42307D',
    contrastText: '#000',
  },
  red: {
    1: '#EF4136',
    2: '#E02D28',
    3: '#F15A29',
    4: '#F04438',
    5: '#FFEEED',
    6: '#FDA29B',
    7: '#FFB0AB',
    8: '#D23930',
    9: '#D9291C',
    10: '#FFF1F0',
  },
  white: {
    1: '#FCFCFC',
    2: '#F6F6F6',
    3: '#FFFFFF',
    4: '#F9FAFB',
    5: '#F9FAFA',
  },
  grey: {
    1: '#F1F2F2',
    2: '#E2E2E2',
    3: '#F6F6F6',
    4: '#D0D5DD',
    5: '#667085',
    6: '#8D8885',
    7: '#344054',
    8: '#C7C7C7',
    9: '#101828',
  },
  slateBrown: {
    1: '#2A2522',
    2: '#232323',
    3: '#312721',
  },
  blue: {
    1: '#3A49E3',
    2: '#EFF0FF',
  },
  yellow: {
    1: '#FFF5E9',
    2: '#F79009',
  },
  green: {
    1: '#EAFAF2',
    2: '#12B76A',
  },
  black: '#000000',
};

// Typography
export const typography = {
  fontFamily: {
    primary: 'Mukta',
  },
  fontSize: {
    fs8: 8,
    fs10: 10,
    fs12: 12,
    fs14: 14,
    fs16: 16,
    fs18: 18,
    fs20: 20,
    fs23: 23,
    fs24: 24,
    fs28: 28,
    fs32: 32,
    fs36: 36,
    fs40: 40,
    fs42: 42,
  },
  fontWeight: {
    thin: '100',
    extraLight: '200',
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },
};

// Shadows
export const shadows = {
  buttonShadow: {
    shadowColor: 'rgba(16, 24, 40, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputShadow: {
    shadowColor: 'rgba(239, 65, 54, 0.05)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  boxShadow1: {
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  boxShadow2: {
    shadowColor: 'rgba(239, 65, 54, 0.16)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  boxShadow3: {
    shadowColor: '#F1F2F2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  boxShadow4: {
    shadowColor: 'rgba(16, 24, 40, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  boxShadowRed1: {
    shadowColor: 'rgba(239, 65, 54, 1)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
};

// Spacing (you can adjust these values as needed)
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Media Breakpoints
export const breakpoints = {
  xxs: 320,
  xsm: 375,
  sm: 480,
  md: 768,
  lg: 1024,
  xlg: 1440,
  xxlg: 2560,
};

// Common styles for text elements
export const textStyles = {
  h1: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs36,
    fontWeight: typography.fontWeight.bold,
    color: colors.grey[9],
  },
  h2: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs32,
    fontWeight: typography.fontWeight.bold,
    color: colors.grey[9],
  },
  h3: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs28,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.grey[9],
  },
  h4: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs24,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.grey[9],
  },
  h5: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs20,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.grey[9],
  },
  h6: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs18,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.grey[9],
  },
  body1: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs16,
    fontWeight: typography.fontWeight.regular,
    color: colors.grey[7],
  },
  body2: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs14,
    fontWeight: typography.fontWeight.regular,
    color: colors.grey[7],
  },
  caption: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs12,
    fontWeight: typography.fontWeight.regular,
    color: colors.grey[6],
  },
  button: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs16,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.white,
  },
};

// Button styles
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary.main,
    color: colors.white,
    ...shadows.buttonShadow,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
    color: colors.white,
    ...shadows.buttonShadow,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary.main,
    borderWidth: 1,
    color: colors.primary.main,
    ...shadows.buttonShadow,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  text: {
    backgroundColor: 'transparent',
    color: colors.primary.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  disabled: {
    backgroundColor: colors.grey[3],
    color: colors.grey[5],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
};

// Input styles
export const inputStyles = {
  default: {
    borderWidth: 1,
    borderColor: colors.grey[4],
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.fs16,
    color: colors.grey[9],
  },
  focus: {
    borderColor: colors.primary.main,
    ...shadows.inputShadow,
  },
  error: {
    borderColor: colors.red[4],
    backgroundColor: colors.red[5],
  },
  disabled: {
    backgroundColor: colors.grey[2],
    color: colors.grey[5],
  },
};

// Export a unified theme object
const theme = {
  colors,
  typography,
  shadows,
  spacing,
  borderRadius,
  breakpoints,
  textStyles,
  buttonStyles,
  inputStyles,
};

export default theme;

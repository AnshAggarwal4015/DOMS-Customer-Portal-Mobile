import React, { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  TouchableOpacityProps,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

// Types
export type ButtonVariantType =
  | 'contained'
  | 'outlined'
  | 'outlined-secondary'
  | 'text'
  | 'outlined-warning';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariantType;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  eventTrackingName?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// Event tracking function (placeholder - implement your tracking method)
const pushEventTracking = (eventName: string) => {
  // Implement your tracking logic here
  // console.log(`Event tracked: ${eventName}`);
};

// Helper function to get style safely with type checking
const getStyleForVariant = (
  styles: Record<string, any>,
  variant: ButtonVariantType,
  suffix: string = ''
): any => {
  // Convert 'outlined-secondary' to 'buttonOutlinedsecondary'
  const formattedVariant =
    variant.charAt(0).toUpperCase() + variant.slice(1).replace('-', '');
  const styleKey = `button${formattedVariant}${suffix}`;

  return styles[styleKey] || {};
};

const Button = forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ButtonProps
>((props, ref) => {
  const {
    variant = 'contained',
    children,
    disabled = false,
    loading = false,
    startIcon,
    endIcon,
    eventTrackingName,
    style,
    textStyle,
    ...otherProps
  } = props;

  const buttonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null);

  useImperativeHandle(
    ref,
    () => buttonRef.current as React.ElementRef<typeof TouchableOpacity>
  );

  const handlePress = () => {
    if (eventTrackingName) {
      pushEventTracking(eventTrackingName);
    }
    // props.onPress && props.onPress(event);
  };

  return (
    <TouchableOpacity
      ref={buttonRef}
      style={[
        styles.buttonRoot,
        getStyleForVariant(styles, variant),
        disabled && getStyleForVariant(styles, variant, 'Disabled'),
        style,
      ]}
      disabled={disabled || loading}
      onPress={handlePress}
      activeOpacity={0.7}
      {...otherProps}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'contained' ? '#FFFFFF' : '#E32929'}
        />
      ) : (
        <View style={styles.buttonContent}>
          {startIcon && <View style={styles.startIcon}>{startIcon}</View>}
          {typeof children === 'string' ? (
            <Text
              style={[
                styles.buttonText,
                getStyleForVariant(styles, variant, 'Text'),
                disabled && getStyleForVariant(styles, variant, 'DisabledText'),
                textStyle,
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {endIcon && <View style={styles.endIcon}>{endIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  buttonRoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 64,
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 42,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontFamily: 'Mukta-Regular', // Make sure you've loaded these fonts
    fontWeight: '500',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  startIcon: {
    marginRight: 8,
  },
  endIcon: {
    marginLeft: 8,
  },
  // Contained button styles
  buttonContained: {
    backgroundColor: '#E32929', // $color-red-1
    paddingHorizontal: 10,
    minWidth: 117,
  },
  buttonContainedText: {
    color: '#FFFFFF',
  },
  buttonContainedDisabled: {
    backgroundColor: '#F4A9A9', // $color-red-7
  },
  buttonContainedDisabledText: {
    color: '#FFFFFF',
  },
  // Outlined button styles
  buttonOutlined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A3F35', // $color-slate-brown-1
    paddingHorizontal: 6,
  },
  buttonOutlinedText: {
    color: '#4A3F35',
  },
  buttonOutlinedDisabled: {
    borderColor: '#C9C9C9', // $color-grey-2
  },
  buttonOutlinedDisabledText: {
    color: '#C9C9C9',
  },
  // Text button styles
  buttonTextText: {
    color: '#E32929', // $color-red-1
  },
  buttonTextDisabled: {
    // No background change needed
  },
  buttonTextDisabledText: {
    color: '#F4A9A9', // $color-red-7
  },
  // Outlined Secondary button styles
  buttonOutlinedsecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E32929', // $color-red-1
    minWidth: 117,
  },
  buttonOutlinedsecondaryText: {
    color: '#E32929',
  },
  buttonOutlinedsecondaryDisabled: {
    borderColor: '#F4A9A9', // $color-red-7
  },
  buttonOutlinedsecondaryDisabledText: {
    color: '#F4A9A9',
  },
  // Outlined Warning button styles
  buttonOutlinedwarning: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0B90B', // $color-yellow-2
    minHeight: 42,
    maxWidth: 117,
  },
  buttonOutlinedwarningText: {
    color: '#F0B90B',
  },
  buttonOutlinedwarningDisabled: {
    borderColor: '#C9C9C9', // $color-grey-2
  },
  buttonOutlinedwarningDisabledText: {
    color: '#C9C9C9',
  },
});

Button.defaultProps = {
  variant: 'contained',
};

export default memo(Button);

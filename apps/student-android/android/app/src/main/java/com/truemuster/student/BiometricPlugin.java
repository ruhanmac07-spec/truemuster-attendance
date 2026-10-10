package com.truemuster.student;

import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.concurrent.Executor;

/**
 * TRUEMUSTER — Native Android BiometricPrompt Capacitor Bridge
 * Connects web check-in pipeline directly to AndroidX BiometricManager & BiometricPrompt.
 * Enforces genuine device owner authentication and never transmits raw biometric data.
 */
@CapacitorPlugin(name = "BiometricPlugin")
public class BiometricPlugin extends Plugin {

    @PluginMethod
    public void checkBiometry(PluginCall call) {
        JSObject ret = new JSObject();
        try {
            BiometricManager biometricManager = BiometricManager.from(getContext());
            int canAuthenticate = biometricManager.canAuthenticate(
                BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.DEVICE_CREDENTIAL
            );

            boolean isAvailable = (canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS);
            String status;

            switch (canAuthenticate) {
                case BiometricManager.BIOMETRIC_SUCCESS:
                    status = "AVAILABLE";
                    break;
                case BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE:
                    status = "NO_HARDWARE";
                    break;
                case BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE:
                    status = "HARDWARE_UNAVAILABLE";
                    break;
                case BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED:
                    status = "NONE_ENROLLED";
                    break;
                case BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED:
                    status = "SECURITY_UPDATE_REQUIRED";
                    break;
                default:
                    status = "UNSUPPORTED";
                    break;
            }

            ret.put("isAvailable", isAvailable);
            ret.put("status", status);
            ret.put("biometryType", "fingerprint_or_face");
            call.resolve(ret);
        } catch (Exception e) {
            ret.put("isAvailable", false);
            ret.put("status", "ERROR");
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void authenticate(PluginCall call) {
        String title = call.getString("title", "Verify Your Identity");
        String subtitle = call.getString("subtitle", "Confirm attendance check-in");
        String description = call.getString("description", "Touch fingerprint sensor or use device credentials");

        getActivity().runOnUiThread(() -> {
            try {
                FragmentActivity activity = (FragmentActivity) getActivity();
                Executor executor = ContextCompat.getMainExecutor(activity);

                BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                        .setTitle(title)
                        .setSubtitle(subtitle)
                        .setDescription(description)
                        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG | BiometricManager.Authenticators.DEVICE_CREDENTIAL)
                        .build();

                BiometricPrompt biometricPrompt = new BiometricPrompt(activity, executor, new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        JSObject ret = new JSObject();
                        ret.put("authenticated", false);
                        ret.put("errorCode", errorCode);
                        ret.put("errorMessage", errString.toString());
                        call.resolve(ret);
                    }

                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        JSObject ret = new JSObject();
                        ret.put("authenticated", true);
                        ret.put("biometryType", "biometric_or_credential");
                        call.resolve(ret);
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                        // Prompt remains open for retry attempts by user
                    }
                });

                biometricPrompt.authenticate(promptInfo);
            } catch (Exception e) {
                JSObject ret = new JSObject();
                ret.put("authenticated", false);
                ret.put("errorCode", -1);
                ret.put("errorMessage", e.getMessage());
                call.resolve(ret);
            }
        });
    }
}

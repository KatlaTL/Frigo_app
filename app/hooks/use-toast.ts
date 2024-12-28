import { Colors } from "@assets/styles";
import * as Burnt from "burnt";

type ToastConfigType = {
    title?: string;
    message?: string;
    duration?: number;
    from?: "top" | "bottom";
    shouldDismissByDrag?: boolean;
}

type AlertConfigType = Omit<ToastConfigType, "from" | "shouldDismissByDrag"> & {
    alertType?: "done" | "error" | "none" | "heart" | "spinner";
    shouldDismissByTap?: true;
}

const defaultToastConfig: Partial<ToastConfigType> = {
    duration: 2,
    from: "top",
    shouldDismissByDrag: true,
}

const defaultAlertConfig: Partial<AlertConfigType> = {
    duration: 2,
    shouldDismissByTap: true,
    alertType: "done"
}

export const useToast = () => {

    const success = (config?: ToastConfigType) => {
        Burnt.toast({
            ...defaultToastConfig,
            ...config,
            title: config?.title ?? "Success",
            preset: "custom",
            haptic: "success",
            icon: {
                ios: {
                    name: "checkmark.circle.fill",
                    color: Colors.primary,
                },
            },
            layout: {
                iconSize: {
                    height: 35,
                    width: 35
                }
            }
        })
    }

    const error = (config?: ToastConfigType) => {
        Burnt.toast({
            ...defaultToastConfig,
            ...config,
            title: config?.title ?? "Noget gik galt",
            message: config?.message ?? "Prøv venligst igen",
            preset: "error",
            haptic: "error"
        })
    }

    const alert = (config?: AlertConfigType) => {
        Burnt.alert({
            ...defaultAlertConfig,
            ...config,
            title: config?.title ?? ""
        })
    }

    return {
        success,
        error,
        alert
    }
}
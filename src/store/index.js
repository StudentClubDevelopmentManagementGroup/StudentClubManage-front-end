import { useSettingStore } from "@/store/setting";
import { useAppStore } from "@/store/app"
import { usePermissionStore } from "@/store/permission"
import { useTabStore } from "@/store/tab"
import { useUserStore } from "@/store/user"
import { useThemeStore } from "@/store/theme"
import { useNavigationStore } from "@/store/navigation"
import { useClubStore } from "@/store/club"
import { useRegistrationStore } from "@/store/registration"

const useStore = {}

export const registerStore = () => {
    useStore.settingStore = useSettingStore()
    useStore.appStore = useAppStore()
    useStore.permissionStore = usePermissionStore()
    useStore.tabStore = useTabStore()
    useStore.userStore = useUserStore()
    useStore.themeStore = useThemeStore()
    useStore.useNavigationStore = useNavigationStore()
    useStore.useClubStore = useClubStore()
    useStore.useRegistrationStore = useRegistrationStore()
}

export default useStore;
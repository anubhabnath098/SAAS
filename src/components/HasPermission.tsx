import { NoPermissionCard } from "./NoPermission";

export function HasNoPermission({
}:{
}){
    const fallbackText="You have already created the maximum number of products. Try upgradng your account to create more."
    return <NoPermissionCard>{fallbackText}</NoPermissionCard>
}
import { ENV_VARS } from "../env";

export async function attemptRefresh() {
    const cachedRefreshToken = localStorage.getItem("refreshtoken");
    if (cachedRefreshToken != null) {
        const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/token/refresh`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refreshtoken: cachedRefreshToken,
                }),
            },
        )
        if (response.status === 200) {
            const data = await response.json();
            localStorage.setItem("refreshtoken", data["refreshtoken"]);
            localStorage.setItem("userid", data["userid"])
            return {
                token: data["token"],
                userid:data["userid"]
            }
        } else return {
            token: null,
            userid: null
        }
    }

}
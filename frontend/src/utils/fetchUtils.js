import { ENV_VARS } from "../env";

/**
 * reads refreshtoken from cache, if exists attempts to get a 
 * new JWT and stores refreshtoken and userid in local storage.
 * Returns object with token, refreshtoken userid and status.
 * 
 * @returns 
 */
export async function attemptRefresh() {
    const cachedRefreshToken = localStorage.getItem("refreshtoken");
    if (cachedRefreshToken != null) {
        if (cachedRefreshToken != null) {
            try {
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
            } catch {
                return {
                    token: null,
                    refreshtoken: null,
                    userid: null,
                    status: 500
                }

            }

            if (response.status === 200) {
                const data = await response.json();
                localStorage.setItem("refreshtoken", data["refreshtoken"]);
                localStorage.setItem("userid", data["userid"])
                return {
                    token: data["token"],
                    refreshtoken: data["refreshtoken"],
                    userid: data["userid"],
                    status: response.status
                }
            } else return {
                token: null,
                refreshtoken: null,
                userid: null,
                status: response.status
            }
        }
    } else {
        return {
            token: null,
            refreshtoken: null,
            userid: null,
            status: 200
        }

    }

}
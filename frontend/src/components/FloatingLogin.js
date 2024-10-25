import { useState, useEffect} from "react";
import "../styles/floatinglogin.css";
import { ENV_VARS } from "../env";
import { AiOutlineLoading } from "react-icons/ai";


export default function FloatingLogin({ userDetails, setUserDetails, setMenuSelection, setLoggedIn, setSignedUp }) {
    const [formData, setFormData] = useState({ email: userDetails["email"], password: "" })
    const [isWaiting, setIsWaiting] = useState(false);
    const [mode, setMode] = useState("login")

    useEffect(() => {
        setFormData({ email: "", password: "" })

    }, [mode])

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    }

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsWaiting(true);

        const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        if (response.status === 201) {
            alert("succesfully signed up");
            setIsWaiting(false);
        } else {
            setIsWaiting(false);
            alert("problem signing up");
        }
        const result = await response.json()

        setSignedUp((prev) => true);
        alert("successfully signed up, next you will be redirected to the login page")
        setMode("login");

    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsWaiting(true);
        // You can perform any validation or submit the form data as needed
        const response = await fetch(`${ENV_VARS.REACT_APP_SERVER_IP}/api/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        });
        if (response.status === 200) {
            const result = await response.json();
            setUserDetails(() => ({
                token: result["token"],
                userid: result["userid"],
            }));
            localStorage.setItem("JWT", result["token"])
            localStorage.setItem("userid", result["userid"])
            setLoggedIn((prev) => true);
            setMenuSelection(() => "learn");
        } else {
            setIsWaiting(false);
            alert("invalid credentials");

        }
    };


    return (
        <div className="floating-login-form" >

            {isWaiting ? <div>
                <AiOutlineLoading className="account-loading" />
            </div> :

                mode === "login" ?
                    <form onSubmit={handleLoginSubmit}>
                        <fieldset className="floating-input-container">
                            <legend>
                                <h3>Log in</h3>
                                <a>
                                    Please log in to continue
                                </a>
                            </legend>
                            <label htmlFor="floating-email">Email</label>
                            <input id="floating-email" name="email" onChange={handleChange} type="email" value={formData.email} />
                            <label htmlFor="floating-password">Password</label>
                            <input id="floating-password" name="password" onChange={handleChange} type="password" value={formData.password} />
                            <input type="submit" value="Log in"></input>
                        </fieldset>
                        <fieldset>
                            <label id="sign-up-label" htmlFor="sign-up">Don't have an account?:</label>
                            <input id="underline-hyperlink" type="button" value="Sign up" onClick={() => setMode("signup")}></input>
                        </fieldset>
                    </form> : mode === "signup" ?
                        <form onSubmit={handleSignupSubmit}>
                            <fieldset className="floating-input-container">
                                <legend>
                                    <h3>Sign up</h3>
                                    <a>
                                        Please Enter your email address and password
                                    </a>
                                </legend>
                                <label htmlFor="floating-email">Email</label>
                                <input id="floating-email" name="email" onChange={handleChange} type="email" value={formData.email} />
                                <label htmlFor="floating-password">Password</label>
                                <input id="floating-password" name="password" onChange={handleChange} type="password" value={formData.password} />
                                <input type="submit" value="Sign up"></input>
                            </fieldset>
                            <fieldset>
                                <label id="login-in-label" htmlFor="login">Already have an account?:</label>
                                <input id="underline-hyperlink" type="button" value="Login" onClick={() => setMode("login")}></input>
                            </fieldset>
                        </form> : null}

        </div>
    )

} 
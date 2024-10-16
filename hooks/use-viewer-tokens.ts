import { createViverToken } from "../actions/token";
import * as React from "react";
import { toast } from "sonner";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const useViewerTokens = (hostIdentity: string) => {
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState("");
  const [name, setName] = React.useState<any>("");
  const [identity, setIdentity] = React.useState("");

  React.useEffect(() => {
    const createViewerToken = async () => {
      try {
        const viewerToken = await createViverToken(hostIdentity);
        setToken(viewerToken);

        const decodedToken = jwtDecode(viewerToken) as JwtPayload & { name?: string };
        const decodedName = decodedToken.name;
        const decodedIdentity = decodedToken.jti;

        if (decodedIdentity) {
          setIdentity(decodedIdentity);
        }

        if (decodedName) {
          setName(decodedName);
        }
      } catch (err) {
        toast.error("Something went wrong");
        setLoading(false);
      }
    };

    createViewerToken();
  }, [hostIdentity]);

  return {
    token,
    name,
    identity,
    loading
  };
};

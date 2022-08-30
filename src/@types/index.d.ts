
import { namespace } from "firebase-functions/v1/firestore";
import { CurrentUser } from "src/services/auth/current-user";

declare global{
    namespace Express{
        interface Request {
            currentUser:CurrentUser
        }
    }
}
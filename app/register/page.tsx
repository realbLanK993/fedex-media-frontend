import LoginForm from "@/components/forms/login";
import RegisterForm from "@/components/forms/register";
import Navbar from "@/components/layout/navbar";
import OldNavbar from "@/components/layout/old-navbar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
    return (
        <div className="flex flex-col h-screen w-screen">
            <OldNavbar />
            {/* <Navbar /> */}
            <main className="flex flex-1 h-full flex-col justify-center items-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RegisterForm />
                    </CardContent>
                    <CardFooter></CardFooter>
                </Card>
            </main>
        </div>
    );
}

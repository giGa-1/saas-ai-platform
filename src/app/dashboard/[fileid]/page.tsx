import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface pageProps {
    params: {
        fileid: string;
    };
}


// Сделать проверку на user адекватную

const page = async ({ params }: pageProps) => {
    const {fileid} = params;

    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileid}`)

    const file = await db.file.findFirst({
        where: {
            id:fileid,
            userId:user.id
        }
    })

    if(!file) notFound();

    return <div className=""></div>;
};

export default page;

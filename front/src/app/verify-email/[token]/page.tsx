import { useParams } from "next/navigation";

import { useDispatch } from "react-redux";
const page: React.FC = () => {

    const token = useParams<{ token: string }>();
    console.log(token);
  const  dispatch = useDispatch()
    return (
        <div>page</div>
    );
};

export default page;
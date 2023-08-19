import React from "react";
import { MembersTable } from "./members-table";
import { columns } from "./columns";
import { axiosInstance } from "@/lib/axios";
import { AddMemberForm } from "./add-member-form";

interface PageProps {
  params: {
    subjectId: string;
  };
}

async function getMembers(subjectId: string) {
  try {
    const res = await axiosInstance.get(
      `/api/subjects/members?subjectId=${subjectId}`
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const Members = async (props: PageProps) => {
  const data = await getMembers(props.params.subjectId);
  return (
    <div>
      <MembersTable columns={columns} data={data} />
      <div className="w-full px-10 pb-10">
        <AddMemberForm subjectId={props.params.subjectId} />
      </div>
    </div>
  );
};

export default Members;

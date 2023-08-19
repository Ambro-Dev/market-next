import { RecentTransports } from "@/components/dashboard/recent-transports";
import { axiosInstance } from "@/lib/axios";
import React from "react";
import { TransportsTable } from "./transports-table";
import { columns } from "./colums";

type Transport = {
  id: string;
  description: string;
  createdAt: Date;
  vehicle: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    username: string;
  };
  type: {
    id: string;
    name: string;
  };
  _count: {
    objects: number;
  };
};

type Props = {
  params: {
    subjectId: string;
  };
};

const getSubjectTransports = async (subjectId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/subjects/subject/transports?subjectId=${subjectId}`
    );
    const data = response.data;
    return data.transports;
  } catch (error) {}
};

const subjectTransports = async (props: Props) => {
  const transportsData = await getSubjectTransports(
    String(props.params.subjectId)
  );

  const transports = await transportsData.map((transport: Transport) => {
    const formatedDate = new Date(transport.createdAt).toLocaleDateString(
      "pl-PL"
    );
    return {
      id: transport.id,
      vehicle: transport.vehicle.name,
      type: transport.type.name,
      category: transport.category.name,
      creator: transport.creator.username,
      objects: transport._count.objects,
      createdAt: formatedDate,
    };
  });

  return <TransportsTable columns={columns} data={transports} />;
};

export default subjectTransports;

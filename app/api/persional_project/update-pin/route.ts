import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import PersonalProject from "../../models/personalProject";
import { OnErrorReturn } from "../../config";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
        const { projectId, pin } = await req.json();

        if (!projectId || pin === undefined) {
            return NextResponse.json(
                {
                    isSuccess: false,
                    message: "projectId and pin are required",
                    data: null,
                },
                { status: 400 }
            );
        }

        await connectDB();

        // Validate if projectId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return NextResponse.json(
                {
                    isSuccess: false,
                    message: "Invalid project ID",
                    data: null,
                },
                { status: 400 }
            );
        }

        const updatedProject = await PersonalProject.findByIdAndUpdate(
            projectId,
            { pin: Boolean(pin), update_at: new Date() },
            { new: true }
        );

        if (!updatedProject) {
            return NextResponse.json(
                {
                    isSuccess: false,
                    message: "Project not found",
                    data: null,
                },
                { status: 404 }
            );
        }

        const res = NextResponse.json(
            {
                isSuccess: true,
                message: `Project ${pin ? "pinned" : "unpinned"} successfully`,
                data: updatedProject,
            },
            { status: 200 }
        );

        return res;
    } catch (error) {
        return OnErrorReturn(error);
    }
}

const { default: mongoose } = require("mongoose");
const asyncHandler = require("../middleware/asyncHandler");
const Project = require("../models/project");
const User = require("../models/User");
const AppError = require("../utils/AppError");

exports.createProject = asyncHandler( async (req, res)=>{
    const {name, description} = req.body;
    if(!name){
        throw new AppError("Name is required", 400);
    }
    const project  = await Project.create({
        name, description,
        createdBy: req.user._id,
        members: [req.user._id]
    })
    res.status(201).json({
        success: true,
        data: project
    });
});

exports.getMyProjects = asyncHandler(async (req, res)=>{
    const projects = await Project.find({members: req.user._id, status: "active"}).populate("createdBy", "name email -_id");
    res.status(200).json({
        success: true,
        data: projects
    });
});

exports.getProjectById = asyncHandler(async (req, res)=>{
    if(!req.params.id){
        throw new AppError("Project ID is required", 400);
    }
    const project = await Project.findOne({
        _id: req.params.id,
        members: req.user._id
    }).populate("createdBy", "name email -_id");
    if(!project){
        throw new AppError("Project not found", 404);
    }
    res.status(200).json({
        success: true,
        data: project
    });
});

exports.addMember = asyncHandler(async (req, res)=>{
    if(!req.params.id){
        throw new AppError("Invalid project ID", 400);
    }
    const projectId = req.params.id;
    const {userId} = req.body;

    if(!projectId || !mongoose.Types.ObjectId.isValid(projectId)){
        throw new AppError("Project ID is required", 400);
    }
    if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
        throw new AppError("User ID is required", 400);
    }
    const project = await Project.findById(projectId)
    if(!project){
        throw new AppError("Project not found", 404);
    }
    if(!project.createdBy.equals(req.user._id)){
        throw new AppError("Forbidden", 403);
    }
    const user = await User.findById(userId);
    if(!user){
        throw new AppError("User not found", 404)
    }
    if(project.members.some((member)=>member.equals(user._id))){
        throw new AppError("User already exists", 400);
    }
    project.members.push(user._id);
    await project.save();

    res.status(200).json({
        success: true,
        data: project
    })
    
});

exports.updateProject = asyncHandler(async (req, res)=>{
    if(!req.params.id){
        throw new AppError("Project ID is required", 400);
    };
    const projectId = req.params.id;
    const {name, description, status} = req.body;
    if(name===undefined && description===undefined && status===undefined){
        throw new AppError("At least one field is required", 400);
    };
    const project = await Project.findById(projectId);
    if(!project){
        throw new AppError("Project not found", 404);
    };
    if(!project.createdBy.equals(req.user._id)){
        throw new AppError("Forbidden", 403);
    };
    if(name!==undefined){
        project.name = name;
    };
    if(description!==undefined){
        project.description = description;
    };
    if(status!==undefined){
        if(!["active","archived"].includes(status)){
            throw new AppError("Invalid status value", 400);
        }
        project.status = status;
    };
    await project.save();
    res.status(200).json({
        success: true,
        data: project
    });
});

exports.deleteProject = asyncHandler(async (req, res)=>{
    if(!req.params.id){
        throw new AppError("Project ID is required", 400);
    }
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if(!project){
        throw new AppError("Project not found", 404);
    }
    if(!project.createdBy.equals(req.user._id)){
        throw new AppError("Forbidden", 403);
    }
    if(project.status === "archived"){
        throw new AppError("Project is already archived", 400);
    }
    project.status = "archived";
    await project.save();
    res.status(200).json({
        success: true,
        data: project
    });
});
const axios = require('axios');
const Liveclass = require('../models/Liveclass');

//create live class
exports.createLiveclass = async (req, res) => {
  try {
    const { title,subject, instructorName, date, time } =  req.body;

    if (!title || !instructorName || !subject || !date || !time) {
      return res.status(400).json({ message: "All  fields are required" });
    }
    
    const roomName = title.toLowerCase().replace(/[^a-z0-9]/g,"-" )+ "-"+ Date.now();

    const dailyres  = await axios.post(
        "https://api.daily.co/v1/rooms",
        {
            name: roomName,
            privacy:"public",
            properties:{
                enable_chat:true,
                enable_screenshare:true,
                start_video_off:false,
                start_audio_off:false,
            },
        },
        {
            headers:{
                Authorization:`Bearer ${process.env.DAILY_API_KEY}`,
                "Content-Type":"application/json",
            },
        }
    );


    const liveclass = await Liveclass.create({
        title,
        subject,
        instructorName,
        date,
        time,
        roomName:dailyres.data.name,
        roomUrl:dailyres.data.url,
        createdBy:req.user.id,
        createdByRole:req.user.role
    });
    res.status(201).json({
      message: "Live class created",
      liveclass,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "liveclass add failed",
    });
  }
};
//fetch all live class
exports.getliveclasses = async (req,res)=>{
    const classes = await Liveclass.find();
    res.json(classes);
}
//singelview
exports.getsingelliveclasses = async (req,res)=>{
    const classes = await Liveclass.findById(req.params.id);
    res.json(classes);
}
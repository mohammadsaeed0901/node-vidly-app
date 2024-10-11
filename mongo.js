const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/play")
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error(err));

const courseSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    category: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: ["web", "mobile", "network"],
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function(v) {
                return v && v.length > 0;
            },
            message: "A course should have at least one tag."
        },
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished; },
        min: 10,
        max: 200,
        get: (v) => Math.round(v), 
        set: (v) => Math.round(v),
    }
});

const Course = mongoose.model("Course", courseSchema);

const createCourse = async () => {
    const course = new Course({
        name: "React.js",
        category: "Web",
        author: "Saeed",
        tags: ["frontend"],
        isPublished: true,
        price: 15.7
    });
    
    try {
        const result = await course.save();
        console.log(result);      
    } catch (error) {
        for (field in error.errors)
            console.log(error.errors[field].message);
    }

};

const getCourses = async () => {
    const pageSize = 10;
    const pageNumber = 2;

    const courses = await Course
    .find({ author: "Saeed", isPublished: true})
    // .find({ price: { $in: [10, 20, 30] } })
    // .find()
    // .and([{ author: "Saeed" }, { isPublished: true }])
    // .find({ author: /^Mosh/i })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

    console.log(courses);
};

const updateCourse = async (id) => {
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: "Jack",
            isPublished: true,
        }
    }, { new: true });
    console.log(course);
}

const deleteCourse = async (id) => {
    const result = await Course.deleteOne({ _id: id });

    console.log(result)
}

createCourse()
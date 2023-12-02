const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let carModels = [
    {
        _id: 1,
        brand: "Tesla",
        model: "Model S",
        year: 2023,
        type: "Electric",
        features: [
            "Autopilot",
            "Long Range",
            "Fast Charging",
            "Premium Interior",
            "Performance Upgrade"
        ]
    },
    {
        _id: 2,
        brand: "Toyota",
        model: "Camry",
        year: 2023,
        type: "Sedan",
        features: [
            "Fuel Efficiency",
            "Advanced Safety",
            "Comfortable Interior",
            "Smartphone Integration"
        ]
    },
    {
        "_id": 3,
        "brand": "BMW",
        "model": "X5",
        "year": 2023,
        "type": "SUV",
        "features": [
            "Luxurious Interior",
            "Powerful Engine",
            "Advanced Driver Assistance",
            "Large Cargo Space",
            "Panoramic Sunroof"
        ]
    },
    {
        "_id": 4,
        "brand": "Honda",
        "model": "Civic",
        "year": 2023,
        "type": "Compact",
        "features": [
            "Fuel Efficiency",
            "Responsive Handling",
            "Modern Infotainment",
            "Honda Sensing Safety Suite"
        ]
    },
    {
        "_id": 5,
        "brand": "Ford",
        "model": "Mustang",
        "year": 2023,
        "type": "Sports Car",
        "features": [
            "Muscular Design",
            "High-Performance Engine",
            "Track-Focused Suspension",
            "Brembo Brake System",
            "SYNC 4 Infotainment"
        ]
    },
    {
        "_id": 6,
        "brand": "Mercedes-Benz",
        "model": "E-Class",
        "year": 2023,
        "type": "Luxury Sedan",
        "features": [
            "Premium Leather Interior",
            "MBUX Infotainment System",
            "Elegant Design",
            "Smooth Ride",
            "Driver Assistance Package"
        ]
    }
];

app.get("/api/cars", (req, res) => {
    res.send(carModels);
});

app.post("/api/cars", upload.single("img"), (req, res) => {
    const result = validateCar(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const car = {
        _id: carModels.length + 1,
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
        type: req.body.type,
        features: req.body.features.split(","),
    }

    carModels.push(car);
    res.send(carModels);
});

app.put("/api/cars/:id", upload.single("img"), (req, res) => {
    
    
    const carId = parseInt(req.params.id);
    const carIndex = carModels.findIndex(car => car._id === carId);

    if (carIndex === -1) {
        res.status(404).send("Car not found");
        return;
    }

    const result = validateCar(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    carModels[carIndex] = {
        _id: carId,
        brand: req.body.brand,
        model: req.body.model,
        year: req.body.year,
        type: req.body.type,
        features: req.body.features.split(","),
    };

    res.send(carModels);
});

app.delete("/api/cars/:id", (req, res) => {
    const carId = parseInt(req.params.id);
    const carIndex = carModels.findIndex(car => car._id === carId);

    if (carIndex === -1) {
        res.status(404).send("Car not found");
        return;
    }

    carModels.splice(carIndex, 1);
    res.send(carModels);
});

const validateCar = (car) => {
    const schema = Joi.object({
        _id: Joi.optional(),
        brand: Joi.string().min(1).required(),
        model: Joi.string().required(),
        year: Joi.number().integer().min(1900).required(),
        type: Joi.string().required(),
        features: Joi.allow(""),
    });

    return schema.validate(car);
};

app.listen(3000, () => {
    console.log("Running");
});
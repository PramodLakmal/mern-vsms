//supplier.moddle.js
import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    nic: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{9}[Vv]$|^[0-9]{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid NIC number! Please enter a valid NIC number in the format xxxxxxxxxV or xxxxxxxxxxxx.`,
        },
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    itemCode: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    
    imageUrl: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2016/02/24/17/15/service-1220327_640.png',
    },
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;

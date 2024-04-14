// employee.model.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
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
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          // Use regular expression to match 10 digits
          return /\d{10}/.test(v);
        },
        message: props => `${props.value} is not a valid phone number! Please enter a 10-digit phone number.`
      }
    },    
    nic: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          // Use regular expression to match the NIC format
          return /^[0-9]{9}[Vv]$|^[0-9]{12}$/.test(v);
        },
        message: props => `${props.value} is not a valid NIC number! Please enter a valid NIC number in the format xxxxxxxxxV or xxxxxxxxxxxx.`
      }
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
    imageUrl: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2016/02/24/17/15/service-1220327_640.png'
    }
  },
  { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;

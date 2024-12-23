import dbConnect from "@/lib/dbConnect";
import CustomerModel, { Customer } from "@/models/customers.models";

export const addCustomer = async (data: Customer) => {
  try {
    await dbConnect();
    let { firstName, middleName, lastName, address, contact, email, dob } =
      data;

    // some operations on data
    firstName = firstName.trim().toLowerCase();
    middleName = middleName?.trim().toLowerCase();
    lastName = lastName.trim().toLowerCase();
    address.street = address.street.trim().toLowerCase();
    address.city = address.city.trim().toLowerCase();
    address.country = address.city.toLowerCase().trim();
    address.state = address.state.toLowerCase().trim();

    // creating model
    const newCustomer = await CustomerModel.create({
      firstName,
      middleName,
      lastName,
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
      contact,
      email,
      dob,
    });

    const savedCustomer = await newCustomer.save();

    if (!savedCustomer)
      return {
        status: false,
        message: "Failed to create your account, try again",
      };
    return {
      success: true,
      message: "Your account has been created successfully",
      data: savedCustomer,
    };
  } catch (error: unknown) {
    console.error("Error saving customer:", error);
    return {
      success: false,
      message: "Failed to create your new account",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const getCustomer = async (id: string) => {
  try {
    await dbConnect();
    const customer = await CustomerModel.findById(id);
    if (!customer)
      return {
        success: false,
        message: "Customer not found",
      };
    return {
      success: true,
      message: "Customer found",
      data: customer,
    };
  } catch (error: unknown) {
    console.error("Error getting customer:", error);
    return {
      success: false,
      message: "Failed to get customer",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const updateCustomer = async (id: string, data: Customer) => {
  try {
    await dbConnect();
    const customer = await CustomerModel.findById(id);
    if (!customer)
      return {
        success: false,
        message: "Customer not found",
      };
    // Update customer data
  } catch (error: unknown) {
    console.error("Error updating customer:", error);
    return {
      success: false,
      message: "Failed to update customer",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

export const deleteCustomer = async (id: string) => {
  try {
    await dbConnect();
    const customer = await CustomerModel.findById(id);
    if (!customer)
      return {
        success: false,
        message: "Customer not found",
        data: null,
      };
    // delete customer before verify some details
    // after it send an email
  } catch (error: unknown) {
    console.error("Error deleting customer:", error);
    return {
      success: false,
      message: "Failed to delete customer",
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

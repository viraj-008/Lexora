"use client";
import { useAddProductsMutation } from "@/store/api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store"; // <-- Add this import
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Bookdetails } from "@/lib/types/type";
import toast from "react-hot-toast";
import Link from "next/link";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import NoData from "../compo/NoData";
import {
  Book,
  Camera,
  ChevronRightIcon,
  CreditCard,
  HelpCircle,
  Loader2,
  Mail,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { filters } from "@/lib/Constent";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const page = () => {
  const [uploadedImages, setuploadedImages] = useState<string[]>([]);
  const [addProducts,{isLoading}] = useAddProductsMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<Bookdetails>({
    defaultValues: {
      images: [],
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const currentFile = watch("images") || [];

      setuploadedImages((prevImages) =>
        [
          ...prevImages,
          ...newFiles.map((file) => URL.createObjectURL(file)),
        ].slice(0, 4)
      );
      setValue("images", [...currentFile, ...newFiles].slice(0, 4) as string[]);
    }
  };

  // RemoveImages function
  const removeImages = (index: number) => {
    setuploadedImages((prev) => prev.filter((_, i) => i !== index));
    const currentFile = watch("images") || [];
    const uploadFiles = currentFile.filter((_, i) => i !== index);
    setValue("images", uploadFiles);
  };

  // onSubmit function
  const onSubmit = async (data: Bookdetails) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([Key, value]) => {
        if (Key !== "images") {
          formData.append(Key, value as string);
        }
      });

      if (Array.isArray(data.images) && data.images.length > 0) {
        data.images.forEach((image) => formData.append("images", image));
      }

      if (data.paymentMode === "UPI") {
        formData.set(
          "paymentDetails",
          JSON.stringify({ upiId: data.paymentDetails.upiId })
        );
      } else if (data.paymentMode === "Bank Account") {
        formData.set(
          "paymentDetails",
          JSON.stringify({ bankDetails: data.paymentDetails.bankDetails })
        );
      }

      const result = await addProducts(formData).unwrap();
      if (result.success) {
        router.push(`books/${result.data._id}`);
        toast.success("Book addes succesfully");
        reset();
      }
    } catch (error) {
      toast.error("failed to list the book please try again later");
      console.log(error);
    }
  };

  const paymentMode = watch("paymentMode");

  const handleOpenLogin = () => {
    dispatch(toggleLoginDialog());
  };

  if (!user) {
    return (
      <NoData
        message="please login to acces your cart"
        description="you need to be loged in to veiw your cart and checkout"
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleOpenLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Sell Your Book</h1>
          <p className="text-gray-600 text-xl mt-4 mb-4">
            Submit a free classified ad to sell your used books for cash in
            India
          </p>
          <Link
            href="/book-sell"
            className="text-blue-500 hover:underline flex justify-center items-center mx-auto w-fit"
          >
            <span>Learn How It Works</span>
            <ChevronRightIcon className="inline-block w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 bg-white p-8 rounded-lg shadow-md"
        >
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-blue-500/10">
              <CardTitle className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                <Book className="mr-2" />
                Book Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              {/* Book Title */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <Label
                  htmlFor="title"
                  className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                >
                  Add Title
                </Label>
                <div className="md:w-3/4">
                  <Input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Title"
                    type="text"
                    className="pl-10 py-3"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Book Category */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <Label
                  htmlFor="category"
                  className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                >
                  Book Type
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <div>
                        <select
                          {...field}
                          className="w-full border rounded px-3 py-2"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {filters.category.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="text-red-500 text-sm">
                            {errors.category.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Book Condition */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <Label
                  htmlFor="condition"
                  className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                >
                  Book Condition
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="condition"
                    control={control}
                    rules={{ required: "Book Condition is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        className="flex  py-2 border rounded px-3 items-center"
                      >
                        {filters.condition.map((condition) => (
                          <div
                            key={condition}
                            className="flex items-center justify-center space-x-2"
                          >
                            <RadioGroupItem
                              value={condition.toLocaleLowerCase()}
                              id={condition.toLocaleLowerCase()}
                            />
                            <Label htmlFor={condition.toLocaleLowerCase()}>
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.condition && (
                    <p className="text-red-500 text-sm">
                      {errors.condition.message}
                    </p>
                  )}
                </div>
              </div>

              {/* class type */}
              <div className="flex flex-col md:flex-row md:items-center md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="classType"
                  className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                >
                  For Class Type
                </Label>
                <div className="md:w-3/4">
                  <Controller
                    name="classType"
                    control={control}
                    rules={{ required: "Class Type is required" }}
                    render={({ field }) => (
                      <div>
                        <select
                          {...field}
                          className="w-full border rounded px-3 py-2"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {filters.classType.map((classType) => (
                            <option key={classType} value={classType}>
                              {classType}
                            </option>
                          ))}
                        </select>
                        {errors.classType && (
                          <p className="text-red-500 text-sm">
                            {errors.classType.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:space-y-0 md:space-x-4">
                <Label
                  htmlFor="subject"
                  className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                >
                  Book Subject
                </Label>

                <div className="md:w-3/4">
                  <Input
                    {...register("subject", {
                      required: "subject is required",
                    })}
                    placeholder="please enter your book subject"
                    type="text"
                    className="pl-10 py-3"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block mb-2 text-center font-medium text-gray-400">
                  Uoloead Photos
                </Label>

                <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50">
                  <div className="flex flex-col items-center gap-2">
                    <Camera className="h-8 w-8 text-blue-600" />
                    <Label
                      htmlFor="images"
                      className="cursor-pointer text-sm font-medium text-blue-500"
                    >
                      Click here to upload up to 4 images (size: 15mb max each)
                    </Label>

                    <Input
                      id="images"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`book image ${index + 1}`}
                            width={200}
                            height={200}
                            className="rounded-lg object-cover w-full h-32 border border-gray-200"
                          />
                          <Button
                            type="button"
                            onClick={() => removeImages(index)}
                            className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* optional detail  */}
          <Card className="shadow-lg border-t-4 border-t-green-500">
            <CardHeader className="bg-green-500/10">
              <CardTitle className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                <HelpCircle className="mr-2 h-6  w-6" /> Option Details
              </CardTitle>
              <CardDescription>
                (Description ,MRP,Author, etc...)
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 ">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1 ">
                  <AccordionTrigger className="cursor-pointer  hover:underline">
                    Book Info
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <Label
                          htmlFor="price"
                          className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                        >
                          MRP
                        </Label>
                        <Input
                          {...register("price", {
                            required: "Book mrp is required",
                          })}
                          placeholder="Enter Book MRP"
                          type="text"
                          className="md:w-3/4"
                        />
                        {errors.price && (
                          <p className="text-red-500 text-sm">
                            {errors.price.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <Label
                          htmlFor="author"
                          className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                        >
                          Author (Year)
                        </Label>
                        <Input
                          {...register("author", {
                            required: "Book mrp is required",
                          })}
                          placeholder="Enter book author name"
                          type="text"
                          className="md:w-3/4"
                        />
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <Label
                          htmlFor="price"
                          className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                        >
                          Edition
                        </Label>
                        <Input
                          {...register("edition", {
                            required: "Book mrp is required",
                          })}
                          placeholder="Enter book edition year"
                          type="text"
                          className="md:w-3/4"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2 ">
                  <AccordionTrigger className="cursor-pointer  hover:underline">
                    Add Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                        <Label
                          htmlFor="price"
                          className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          {...register("description", {})}
                          placeholder="Enter book description"
                          className="md:w-3/4"
                          rows={4}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* price details  */}
          <Card className="shadow-lg border-t-4 border-t-red-500">
            <CardHeader className="bg-blue-500/10">
              <CardTitle className="text-2xl font-bold text-yellow-700 mb-4 flex items-center">
                <Book className="mr-2" />
                Price Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              {/* Book Title */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <Label
                  htmlFor="title"
                  className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                >
                  Your Price.
                </Label>
                <div className="md:w-3/4">
                  <Input
                    id="finalPrice"
                    {...register("finalPrice", {
                      required: "finalPrice is required",
                    })}
                    placeholder="please enter book final Price"
                    type="text"
                    className="pl-10 py-3"
                  />
                  {errors.finalPrice && (
                    <p className="text-red-500 text-sm">
                      {errors.finalPrice.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Book Category */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <Label className="mb-2 md:mb-0 mt-2 font-medium text-gray-700 w-32">
                  Shipping Chages
                </Label>
                <div className="md:w-3/4 space-y-3/4">
                  <div className="flex items-center gap-4">
                    <Input
                      id="shippingCharge"
                      {...register("shippingCharge")}
                      placeholder="please enter book shipping Charge"
                      type="text"
                      className="w-full md:w-1/2"
                      disabled={watch("shippingCharge") === "free"}
                    />
                    <span className="text-sm">Or</span>
                    <Controller
                      name="shippingCharge"
                      control={control}
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="freeShipping"
                            checked={field.value === "free"}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? "free" : "");
                            }}
                          />
                          <Label htmlFor="freeshipping">Free Shipping</Label>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Buyer prefer free shipping or low shipping charge
              </p>
            </CardContent>
          </Card>

          {/* Bank details */}
          <Card className="shadow-lg border-t-4 border-t-blue-500">
            <CardHeader className="bg-blue-500/10">
              <CardTitle className="text-2xl font-bold text-yellow-700 mb-4 flex items-center">
                <CreditCard className="mr-2 " />
                Bank Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                <Label
                  htmlFor="category"
                  className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                >
                  Payment Mode
                </Label>
                <div className="md:w-3/4 space-y-2">
                  <p className="text-sm text-gray-500 mb-">
                    After your book is sold, in what mode would you like to
                    receive payment?
                  </p>
                  <Controller
                    name="paymentMode"
                    control={control}
                    rules={{ required: "Payment Mode is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex  py-2 spaxe-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="UPI"
                            id="UPI"
                            {...register("paymentMode")}
                          />
                          <Label htmlFor="UPI">UPI ID/NUMBER</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Bank Account"
                            id="Bank Account"
                            {...register("paymentMode")}
                          />
                          <Label htmlFor="Bank account">Bank Account</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.paymentMode && (
                    <p className="text-red-500 text-sm">
                      {errors.paymentMode.message}
                    </p>
                  )}
                </div>
              </div>

              {paymentMode === "UPI" && (
                <>
                <div className="flex flex-col md:flex-row md:items-center md:space-y-0 md:space-x-4">
                  <Label
                    htmlFor="upiId"
                    className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                  >
                    UPI ID
                  </Label>

                  <Input
                    {...register("paymentDetails.upiId", {
                      required: "UPI ID is required",
                      pattern: {
                        value: /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/,
                        message: "Invalid UPI ID format",
                      },
                    })}
                    placeholder="please enter your UPI ID"
                    type="text"
                    className="pl-10 py-3"
                  />
                  {errors.paymentDetails?.upiId && (
                    <p className="text-red-500 text-sm">
                      {errors.paymentDetails.upiId.message}
                    </p>
                  )}
                </div>
                </>
              )}

              {paymentMode === "Bank Account" && (
                <>
                <div className="flex flex-col md:flex-row md:items-center md:space-y-0 md:space-x-4">
                  <Label
                    htmlFor="accountNumber"
                    className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                  >
                    Bank Account Number
                  </Label>

                  <Input
                    {...register("paymentDetails.bankDetails.accountNumber", {
                      required: "Bank Account Number is required",
                      pattern: {
                        value: /^[0-9]{9,18}$/,
                        message: "Invalid Bank Account Number format",
                      },
                    })}
                    placeholder="please enter your Bank Account Number"
                    type="text"
                    className="pl-10 py-3"
                  />
                  {errors.paymentDetails?.bankDetails?.accountNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.paymentDetails?.bankDetails.accountNumber.message}
                    </p>
                  )}
                </div>

                  <div className="flex flex-col md:flex-row md:items-center md:space-y-0 md:space-x-4">
                  <Label
                    htmlFor="ifscCode"
                    className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                  >
                    IFSC Code
                  </Label>

                  <Input 
                    {...register("paymentDetails.bankDetails.ifscCode", {
                      required: "IFSC Code is required",
                      pattern: {
                        value: /^[A-Z]{4}[0-9]{6}$/,
                        message: "Invalid IFSC Code format",
                      },
                    })}
                    placeholder="please enter your IFSC Code"
                    type="text"
                    className="pl-10 py-3"
                  />
                  {errors.paymentDetails?.bankDetails?.ifscCode && (
                    <p className="text-red-500 text-sm">
                      {errors.paymentDetails?.bankDetails.ifscCode.message}
                    </p>
                  )}
                </div>

  <div className="flex flex-col md:flex-row md:items-center md:space-y-0 md:space-x-4">
                  <Label
                    htmlFor="bank Name"
                    className="mb-2 md:mb-0 font-medium text-gray-700 w-32"
                  >
                   Bank Name 
                  </Label>

                  <Input 
                    {...register("paymentDetails.bankDetails.bankName", {
                      required: "Bank Name is required",
                      pattern: {
                        message: "Invalid Bank Name",
                      },
                    })}
                    placeholder="please enter your Bank Name"
                    type="text"
                    className="pl-10 py-3"
                  />
                  {errors.paymentDetails?.bankDetails?.bankName && (
                    <p className="text-red-500 text-sm">
                      {errors.paymentDetails?.bankDetails.bankName.message}
                    </p>
                  )}
                </div>
                
                </>
              )}
              

              
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading} className="w-60 mx-auto font-semibold rounded-lg transition duration-300 ease-in-out hover:scale-105 text-md bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600">{isLoading ? (<><Loader2 className="animate-spin mr-2"/>Saving...</>):("Post Your Book")}</Button>
          <p className="text-sm text-center text-gray-600 ">By Clicking Post Your Book, you agree to our Terms of Service and Privacy Policy.</p>
        </form>
      </div>
    </div>
  );
};
export default page;

                 
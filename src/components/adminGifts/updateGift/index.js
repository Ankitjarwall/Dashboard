import React, { useEffect, useState } from 'react';
import "./updateGift.css";
import axios from 'axios';

export default function UpdateGift({ updateState, setUpdateState }) {
    const [name, setName] = useState(updateState.name);
    const [image, setImage] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(updateState.image);
    const [price, setPrice] = useState(updateState.price);
    const [discount, setDiscount] = useState(updateState.discount);
    const [available, setAvailable] = useState(updateState.availability);

    useEffect(() => { console.log(updateState) }, []);

    //function to validate the image
    function validateImg(e) {
        const file = e.target.files[0];
        if (file.size >= 1048576) {
            return alert("Max file size is 1 Mb!");
        }
        else {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    //function to host the image on the cloudinary
    async function uploadImage(image) {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "yukw2rxf");
        try {
            setUploadingImg(true);
            let res = await fetch("https://api.cloudinary.com/v1_1/dq4iomrfv/image/upload", { method: "post", body: data });
            const urlData = await res.json();
            setUploadingImg(false);
            return urlData.url
        } catch (error) {
            setUploadingImg(false);
            console.log(error);
        }
    }

    //function to handle the submit event
    async function handleSubmitEvent() {
        if (image) {
            const url = await uploadImage(image);
            setImagePreview(url);
        }
        let data = { giftId: updateState._id, data: { name, image: setImagePreview, price, discount, availability: available } };
        let token = localStorage.getItem("authToken");
        let config = {
            headers: { authorization: `Bearer ${token}` }
        };
        axios.post("http://localhost:5050/api/v1/gifts/updateGift", data, config)
            .then((res) => { return alert("The gift has been successfully edited."); })
            .catch((err) => { console.log(err); alert(err.response.data) })
    }

    return (
        <div className='absolute-center-column'>
            <div className="create-prop-form-title text-center" style={{ marginTop: "0px", width: "500px" }}>
                <span class="material-symbols-outlined hover-effect" style={{ position: "absolute", left: "200px" }} onClick={() => { setUpdateState(null) }}>
                    arrow_back_ios
                </span>
                Gift Edit Form
            </div>
            <div className='create-gift-form-container' style={{ width: "600px" }}>
                <div className='absolute-center-column'>
                    <div className="create-prop-form-label text-center">Name</div>
                    <input type="text" placeholder='Enter the name of the gift...' className='create-prop-form-input' onChange={(e) => { setName(e.target.value) }} value={name} />
                    <div className="create-prop-form-label text-center">Price</div>
                    <input type="text" placeholder='Enter the price of the gift...' className='create-prop-form-input' onChange={(e) => { setPrice(e.target.value) }} value={price} />
                    <div className="create-prop-form-label text-center">Discount</div>
                    <input type="text" placeholder='Enter the discount offered...' className='create-prop-form-input' onChange={(e) => { setDiscount(e.target.value) }} value={discount} />
                </div>
                <div className="absolute-center-column">
                    <div className='giftImageContainer'>
                        <img src={imagePreview} alt="" className='gift-preview-image' />
                    </div>
                    <div style={{ marginTop: "12px" }}>
                        <label htmlFor="new-gift-image">
                            <span class="material-symbols-outlined edit-logo-icon set-add-image-position">
                                add_a_photo
                            </span>
                        </label>
                        <input type="file" hidden id="new-gift-image" onChange={validateImg} />
                    </div>
                    <div className='absolute-center-column'>
                        <div className='available-container'>
                            <div className="circle hover-effect" style={available ? { backgroundColor: "green", opacity: 0.6 } : { backgroundColor: "none", opacity: 0 }} onClick={() => { setAvailable(true) }}></div>
                            <div>Available</div>
                        </div>
                        <div className='available-container'>
                            <div className="circle hover-effect" style={!available ? { backgroundColor: "red", opacity: 0.6 } : { backgroundColor: "none", opacity: 0 }} onClick={() => { setAvailable(false) }}></div>
                            <div>Not-available</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="create-prop-form-button text-center hover-effect" style={{ marginTop: "8px" }} onClick={handleSubmitEvent}>Update</div>
        </div >
    )
}

import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop from 'react-image-crop'

export default function changePicture() {
	const [file, setFile] = useState(null)
	const [crop, setCrop] = useState({ aspect: 1 / 1 })
	const [croppedImageUrl, setCroppedImageUrl] = useState('')
	const [croppedImageFile, setCroppedImageFile] = useState(null)

	return <div></div>
}

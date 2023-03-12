import React, { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'
import { canvasPreview } from '../utils/canvasPreview'
import { useDebounceEffect } from '../utils/useDebounceEffect'
import { AiOutlineArrowLeft, AiOutlineCloudUpload } from 'react-icons/ai'
import 'react-image-crop/dist/ReactCrop.css'
import Link from 'next/link'

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
	return centerCrop(
		makeAspectCrop(
			{
				unit: '%',
				width: 90,
			},
			aspect,
			mediaWidth,
			mediaHeight
		),
		mediaWidth,
		mediaHeight
	)
}

export default function changePicture() {
	const [imgSrc, setImgSrc] = useState('')
	const previewCanvasRef = useRef(null)
	const imgRef = useRef(null)
	const [crop, setCrop] = useState()
	const [completedCrop, setCompletedCrop] = useState()
	const [scale, setScale] = useState(1)
	const [rotate, setRotate] = useState(0)
	const [aspect, setAspect] = useState(1)
	const [updateStatus, setUpdateStatus] = useState(false)
	const [updateMessage, setUpdateMessage] = useState('')
	const { status, data } = useSession()
	const email = data?.user.email

	function onSelectFile(e) {
		if (e.target.files && e.target.files.length > 0) {
			setCrop(undefined) // Makes crop preview update between images.
			const reader = new FileReader()
			reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
			reader.readAsDataURL(e.target.files[0])
		}
	}

	function onImageLoad(e) {
		if (aspect) {
			const { width, height } = e.currentTarget
			setCrop(centerAspectCrop(width, height, aspect))
		}
	}

	useDebounceEffect(
		async () => {
			if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
				// We use canvasPreview as it's much faster than imgPreview.
				canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate)
			}
		},
		100,
		[completedCrop, scale, rotate]
	)
	async function handleSaveImage() {
		const canvas = previewCanvasRef.current
		const dataUrl = canvas.toDataURL('image/png')
		try {
			const response = await fetch('/api/save-image', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ dataUrl, email }),
			})
			const info = await response.json()
			console.log(info)
			setUpdateMessage(`Picture updated, You will be redirected`)
			setUpdateStatus(true)
			setTimeout(() => {
				setUpdateStatus(null)
				setUpdateMessage(``)
				Router.replace('/Home')
			}, 3000)
		} catch (error) {
			console.error(error)
			setUpdateMessage('Something went wrong')
			setUpdateStatus(false)
			setTimeout(() => {
				setUpdateStatus(null)
				setUpdateMessage(``)
			}, 3000)
		}
	}
	return (
		<>
			<Link href="/" className="go-back">
				<AiOutlineArrowLeft></AiOutlineArrowLeft>Go to main page
			</Link>
			{updateMessage ? (
				updateStatus == false ? (
					<p className="error">
						{updateMessage}
						<span></span>
					</p>
				) : (
					<p className="success">
						{updateMessage}
						<span></span>
					</p>
				)
			) : (
				<></>
			)}
			<div className="crop-container">
				<div className="Crop-Controls">
					<div className="drop-zone">
						<input type="file" accept="image/*" onChange={onSelectFile} />
						<AiOutlineCloudUpload></AiOutlineCloudUpload>
						<span>Drag and Drop or Click to Upload File</span>
					</div>
					<div className="crop-input">
						<label htmlFor="scale-input">Scale: </label>
						<input id="scale-input" min={0} max={5} type="number" step="0.1" value={scale} disabled={!imgSrc} onChange={(e) => setScale(Number(e.target.value))} />
					</div>
					<div className="crop-input">
						<label htmlFor="rotate-input">Rotate: </label>
						<input id="rotate-input" type="number" value={rotate} disabled={!imgSrc} onChange={(e) => setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))} />
					</div>
				</div>
				{!!imgSrc && (
					<>
						<h3>Image: </h3>
						<ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={aspect}>
							<img ref={imgRef} alt="Crop me" src={imgSrc} style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }} onLoad={onImageLoad} />
						</ReactCrop>
					</>
				)}
				<div>
					{!!completedCrop && (
						<>
							<h3>Preview:</h3>
							<canvas ref={previewCanvasRef} className="canvas" />
						</>
					)}
				</div>
				<div className="buttons">
					<Link href="/Home">Cancel</Link>
					<button onClick={handleSaveImage} disabled={!completedCrop}>
						<span>Save</span>
					</button>
				</div>
			</div>
		</>
	)
}

import React, { useState, useRef } from 'react'

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'
import 'react-image-crop/dist/ReactCrop.css'
import Link from 'next/link'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
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
	function handleSaveImage() {
		const canvas = previewCanvasRef.current
		const link = document.createElement('a')
		const fileName = Date.now()
		canvas.toBlob((blob) => {
			const url = URL.createObjectURL(blob)
			link.href = url
			link.download = `${fileName}.png`
			link.click()
			URL.revokeObjectURL(url)
		})
	}
	return (
		<div className="crop-container">
			<div className="Crop-Controls">
				<input type="file" accept="image/*" onChange={onSelectFile} />
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
						<div className="buttons">
							<Link href="/Home">Cancel</Link>
							<button onClick={handleSaveImage}>
								<span>Save</span>
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

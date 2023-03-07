import fs from 'fs'

export default async function saveImage(req, res) {
  const { dataUrl } = req.body
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
  const fileName = Date.now() + '.png'
  const filePath = 'public/images/' + fileName

  try {
    await fs.promises.writeFile(filePath, base64Data, 'base64')
    res.status(200).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to save image' })
  }
}

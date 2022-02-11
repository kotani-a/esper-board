import bomb from '../../../constants/bomb.json'

export default function handler(req, res) {
  res.status(200).json(bomb)
}

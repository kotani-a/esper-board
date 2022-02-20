import bomb from '../../../constants/esper/bomb.json'

export default function handler(req, res) {
  res.status(200).json(bomb)
}

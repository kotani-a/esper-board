import cactuar from '../../../constants/cactuar.json'

export default function handler(req, res) {
  res.status(200).json(cactuar)
}

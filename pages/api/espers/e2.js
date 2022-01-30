import ifrit from '../../../constants/ifrit.json'

export default function handler(req, res) {
  res.status(200).json(ifrit)
}

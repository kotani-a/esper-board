import ifrit from '../../../constants/esper/ifrit.json'

export default function handler(req, res) {
  res.status(200).json(ifrit)
}

import NetworkService from '../NetworkService';

class RoomsService extends NetworkService {
  public url = '/rooms'
  constructor(params) {
    super(params);
  }
}
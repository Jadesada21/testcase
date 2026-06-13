import { Injectable } from '@nestjs/common';
import { FindOrCreateDto } from './dto/findOrCreate.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserRole } from './enum/user.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findByFirebaseUid(firebaseUid: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ firebaseUid }).exec()
  }

  async findOrCreate(data: FindOrCreateDto): Promise<UserDocument> {
    let user = await this.findByFirebaseUid(data.firebaseUid)
    if (!user) {
      user = await this.userModel.create({ ...data, role: UserRole.USER })
    }
    return user
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec()
  }
}

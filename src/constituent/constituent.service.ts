import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateConstituentDto, UpdateConstituentDto } from './constituent.dto';
import { start } from 'repl';

@Injectable()
export class ConstituentService {
  constructor(private prisma: PrismaService) {}

  async create(createConstituentDto: CreateConstituentDto) {
    const { names, addresses, email } = createConstituentDto;
    const constituent = await this.findOneByEmail(email);

    if (constituent != -1 ){
        // set up the update Dto, eventually want to allow for collection of multiple names and addresses in subsequent requests
        let updateConstituentDto: UpdateConstituentDto = {};
        updateConstituentDto.addresses = addresses;
        updateConstituentDto.names = names;
        return this.update(constituent.id, updateConstituentDto)
    }
    // Create the person with names and addresses using nested writes
    return this.prisma.person.create({
      data: {
        email,
        names: {
          create: names,
        },
        addresses: {
          create: addresses,
        },
      },
      include: {
        names: true,
        addresses: true,
      },
    });
  }

  async findAll(startDate?: Date) {
    return this.prisma.person.findMany({
      include: {
        names: true,
        addresses: true,
      },
      where: {
        dateCreated: {
            gte: startDate
        }
      },
      orderBy: {
        dateCreated: 'asc'
      }
    });
  }

  async findOne(id: number) {
    const constituent = await this.prisma.person.findUnique({
      where: { id },
      include: {
        names: true,
        addresses: true,
      },
    });
    
    if (!constituent) {
      throw new NotFoundException(`Constituent with ID ${id} not found`);
    }
    
    return constituent;
  }

  async findOneByEmail(email: string) {
    const constituent = await this.prisma.person.findUnique({
      where: { email },
      include: {
        names: true,
        addresses: true,
      },
    });
    
    if (!constituent) {
      return -1;
    }
    
    return constituent;
  }

  async update(id: number, updateConstituentDto: UpdateConstituentDto) {
    const { names, addresses, email } = updateConstituentDto;

    // Prepare the update data
    const updateData: any = {};
    
    if (email !== undefined) {
      updateData.email = email;
    }

    // If names are provided, update them
    if (names) {
      updateData.names = {
        deleteMany: {}, // Delete all existing names
        create: names,  // Create the new ones
      };
    }

    // If addresses are provided, update them
    if (addresses) {
      updateData.addresses = {
        deleteMany: {}, // Delete all existing addresses
        create: addresses, // Create the new ones
      };
    }

    try {
      // Perform the update with nested writes
      return await this.prisma.person.update({
        where: { id },
        data: updateData,
        include: {
          names: true,
          addresses: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Constituent with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      // Use cascading deletes with nested writes
      return await this.prisma.person.delete({
        where: { id },
        include: {
          names: true,
          addresses: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Constituent with ID ${id} not found`);
      }
      throw error;
    }
  }
  
  async exportConstituents(startDate?: Date) {
    // Get all constituents with their names and addresses
    return this.prisma.person.findMany({
      include: {
        names: true,
        addresses: true,
      },
      where: {
        dateCreated: {
            gte: startDate
        }
      },
      orderBy: {
        dateCreated: 'asc'
      }
    });
  }
  
  // Helper method to get preferred name and address
  getPreferredDetails(constituent) {
    // Find preferred name or take the first one
    const preferredName = constituent.names.find(name => name.isPreferred) || constituent.names[0] || {};
    
    // Find preferred address or take the first one
    const preferredAddress = constituent.addresses.find(addr => addr.isPreferred) || constituent.addresses[0] || {};
    
    return {
      ...constituent,
      preferredName,
      preferredAddress
    };
  }
}

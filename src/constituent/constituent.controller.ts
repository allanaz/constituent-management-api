import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
    ParseIntPipe,
    Res,
    Query,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { stringify } from 'csv-stringify';
  import { ConstituentService } from './constituent.service';
  import { CreateConstituentDto, UpdateConstituentDto } from './constituent.dto';
  
  @Controller('constituents')
  @UseInterceptors(ClassSerializerInterceptor)
  export class ConstituentController {
    constructor(private readonly constituentService: ConstituentService) {}
  
    @Post()
    create(@Body() createConstituentDto: CreateConstituentDto) {
      return this.constituentService.create(createConstituentDto);
    }
  
    @Get()
    findAll() {
      return this.constituentService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.constituentService.findOne(id);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateConstituentDto: UpdateConstituentDto,
    ) {
      return this.constituentService.update(id, updateConstituentDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.constituentService.remove(id);
    }
  
    @Get('export/csv')
    async exportToCsv(@Query('startDate') startDateString: string, @Res() res: Response) {
        
      const filterDate = startDateString ? new Date(startDateString): undefined;
      if (filterDate !== undefined && isNaN(filterDate.getDate())){
        throw new Error('Invalid Date Format');
      }
      // Get all constituents
      const constituents = await this.constituentService.exportConstituents(filterDate);
      
      // Process data for CSV export - only include preferred name and address
      const csvData = constituents.map(constituent => {
        // Use the service method to get preferred details
        const { preferredName, preferredAddress } = this.constituentService.getPreferredDetails(constituent);
        
        // Create a flattened row with preferred name and address
        return {
          id: constituent.id,
          email: constituent.email,
          // Name fields
          title: preferredName.title || '',
          firstName: preferredName.first || '',
          middleName: preferredName.middle || '',
          lastName: preferredName.last || '',
          suffix: preferredName.suffix || '',
          // Address fields
          addressLine1: preferredAddress.line1 || '',
          addressLine2: preferredAddress.line2 || '',
          city: preferredAddress.city || '',
          state: preferredAddress.state || '',
          postalCode: preferredAddress.postalCode || '',
          addressType: preferredAddress.type || '',
        };
      });
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=constituents.csv');
      
      // Stream the CSV data to the response
      const stringifier = stringify({ header: true });
      stringifier.pipe(res);
      
      // Write data to the stream
      csvData.forEach(row => stringifier.write(row));
      stringifier.end();
    }
  }

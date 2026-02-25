import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagsStringToListPipe',
})
export class TagsStringToListPipePipe implements PipeTransform {

  transform(value: string): string[] {
    if (value == null) {
      return [];
    }

    const list = value.split(',').map(x => x.trim());
    const noDups = [...new Set(list)];

    return noDups;

  }

}

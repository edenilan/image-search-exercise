import {AfterViewInit, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef} from '@angular/material/dialog';
import Konva from 'konva'
import {Stage} from 'konva/lib/Stage';
import {Line, LineConfig} from 'konva/lib/shapes/Line';
import {Vector2d} from 'konva/lib/types';
import {MatButton} from '@angular/material/button';
import {AnnotatedImageMetadata} from '../image-metadata.type';

export interface DialogData {
  imageMetadata: AnnotatedImageMetadata;
}

@Component({
  selector: 'image-viewer',
  imports: [
    MatButton,
    MatDialogActions
  ],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
  host: {
    '(keyup.Escape)': 'cancelInProgressPolygon()',
    '(keyup.Backspace)': 'deleteSelectedPolygon()',
  }
})
export class ImageViewerComponent implements AfterViewInit{
  private matDialogData: DialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);
  private imageUrl = this.matDialogData.imageMetadata.largeImageURL;
  private stage!: Stage;
  private polygonInProgress: Line | undefined;
  private nextPointLineIndicator: Line;
  private transformer: Konva.Transformer;
  private readonly layer: Konva.Layer;

  get annotations(): LineConfig[] {
    if (this.layer == null) {
      return [];
    }

    return this.layer.children
      .filter(child => child.getType() === 'Shape' && (child as Line).points?.() != null)
      .map(shape => (shape as Line).attrs);
  }

  constructor() {
    this.nextPointLineIndicator = new Line({
      stroke: 'lightgrey',
    });

    this.transformer = new Konva.Transformer({
      rotateAnchorOffset: 30,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    });

    this.layer = new Konva.Layer();
  }
  ngAfterViewInit(): void {
    this.setupStage();
  }

  private isPointerPositionBackToStartOfLine(line: Line): boolean {
    const pointerPosition = this.stage.getPointerPosition();
    const firstPointX = line?.points?.()?.[0];
    const firstPointY = line?.points?.()?.[1];

    if (pointerPosition == null || firstPointX == null || firstPointY == null) {
      return false;
    }

    const firstPointVector = {x : firstPointX, y : firstPointY};
    const isPointerCloseToStartOfLine = this.arePointsAdjacent(pointerPosition, firstPointVector);

    return isPointerCloseToStartOfLine;
  }

  private arePointsAdjacent(point1: Vector2d, point2: Vector2d, distanceThreshold: number = 15): boolean {
    const distance = Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));

    return distance < distanceThreshold;
  }

  private finalizePolygonInProgress() {
    if (this.polygonInProgress == null) {
      return;
    }

    this.polygonInProgress.closed(true);
    this.polygonInProgress.draggable(true);
    this.transformer?.nodes([this.polygonInProgress]);

    this.polygonInProgress = undefined;
  }

  cancelInProgressPolygon() {
    this.polygonInProgress?.points([]);
    this.nextPointLineIndicator.points([]);
  }

  deleteSelectedPolygon() {
    const selectedPolygon = this.transformer.nodes()[0];

    if (selectedPolygon == null) {
      return;
    }

    selectedPolygon.destroy();
    this.transformer.nodes([]);
  }

  private async loadImage(): Promise<Konva.Image> {
    const imagePromise = new Promise<Konva.Image>(resolve => {
      const imageObj = new Image();
      imageObj.onload = () => {
        const maxWidth = this.stage.width();
        const maxHeight = this.stage.height();

        const scale = Math.min(maxWidth / imageObj.width, maxHeight / imageObj.height);

        const konvaImage = new Konva.Image({
          x: this.stage.width() / 2,
          y: this.stage.height() / 2,
          image: imageObj,
          width: imageObj.width * scale,
          height: imageObj.height * scale,
          offsetX: (imageObj.width * scale) / 2,
          offsetY: (imageObj.height * scale) / 2,
        });

        this.layer.add(konvaImage);
        this.layer.add(this.transformer);
        this.layer.add(this.nextPointLineIndicator);

        resolve(konvaImage);
      };

      imageObj.src = this.imageUrl;
    });

    return imagePromise;
  }

  private async setupStage() {
    this.stage = new Konva.Stage({
      container: 'canvas-container',
      width: 500,
      height: 500,
    });

    this.stage.add(this.layer);

    await this.loadImage();

    this.addPreExistingAnnotations();

    this.stage.on('click', () => {
      const pointerPosition = this.stage.getPointerPosition();

      if (pointerPosition == null) {
        return;
      }

      this.transformer?.nodes([]);

      const existingPolygonClicked =
        this.layer.children.find(shape => (shape as Line).closed?.() && (shape as Line).intersects?.(pointerPosition));

      if (existingPolygonClicked != null) {
        this.transformer?.nodes([existingPolygonClicked]);
        return;
      }

      this.nextPointLineIndicator.points([]);

      if (this.polygonInProgress == null) {
        this.polygonInProgress = new Konva.Line({
          points: [pointerPosition.x, pointerPosition.y],
          stroke: 'red',
          draggable: false,
        });

        this.layer.add(this.polygonInProgress);
      }
      else {
        if (this.isPointerPositionBackToStartOfLine(this.polygonInProgress)) {
          this.finalizePolygonInProgress();
        }

        else {
          const prevPoints = this.polygonInProgress.points();

          this.polygonInProgress.points([...prevPoints, pointerPosition.x, pointerPosition.y]);
        }
      }
    });

    this.stage.on('mousemove', () => {
      const pointerPosition = this.stage.getPointerPosition();

      if (pointerPosition == null) {
        return;
      }

      const polygonInProgressLastPointX = this.polygonInProgress?.points()[this.polygonInProgress?.points().length - 2];
      const polygonInProgressLastPointY = this.polygonInProgress?.points()[this.polygonInProgress?.points().length - 1];

      if (this.polygonInProgress != null && polygonInProgressLastPointX != null && polygonInProgressLastPointY != null) {
        this.nextPointLineIndicator.points([
          polygonInProgressLastPointX,
          polygonInProgressLastPointY,
          pointerPosition.x,
          pointerPosition.y
        ]);
      }
    });
  }

  private addPreExistingAnnotations() {
    const existingAnnotations = this.matDialogData.imageMetadata.annotations

    if (existingAnnotations == null || existingAnnotations?.length === 0) {
      return;
    }

    existingAnnotations.forEach((annotation) => {
      const line = new Konva.Line(annotation);
      this.layer.add(line);
    })
  }

  closeDialog() {
    this.dialogRef.close({annotations: this.annotations});
  }
}
